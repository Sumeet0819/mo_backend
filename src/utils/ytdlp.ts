import { spawn } from 'child_process';
import pino from 'pino';
import path from 'path';

const logger = pino();

export interface YtDlpOptions {
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
}

const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path.resolve(process.cwd(), binaryName);

export const runYtDlp = (args: string[], options?: YtDlpOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    const process = spawn(ytDlpPath, [...args, '--no-warnings']);
    let stdout = '';
    let stderr = '';

    const onAbort = () => {
      process.kill();
      reject(new Error('Aborted'));
    };

    if (options?.signal) {
      if (options.signal.aborted) {
        return onAbort();
      }
      options.signal.addEventListener('abort', onAbort);
    }

    process.stdout.on('data', (data) => {
      const chunk = data.toString();
      stdout += chunk;
      
      if (options?.onProgress) {
        const match = chunk.match(/\[download\]\s+([\d\.]+)%/);
        if (match && match[1]) {
          options.onProgress(parseFloat(match[1]));
        }
      }
    });

    process.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    process.on('close', (code) => {
      if (options?.signal) {
        options.signal.removeEventListener('abort', onAbort);
      }
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        // If aborted, code is usually null or non-zero, but we already rejected.
        // Prevent unhandled rejection if already aborted.
        if (options?.signal?.aborted) return;
        logger.error({ code, stderr, args }, 'yt-dlp execution failed');
        reject(new Error(`yt-dlp failed with code ${code}: ${stderr}`));
      }
    });
  });
};
