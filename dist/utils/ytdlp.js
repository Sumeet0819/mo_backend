"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runYtDlp = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const logger_1 = require("./logger");
const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path_1.default.resolve(process.cwd(), binaryName);
const runYtDlp = (args, options) => {
    return new Promise((resolve, reject) => {
        const process = (0, child_process_1.spawn)(ytDlpPath, [...args, '--no-warnings']);
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
            }
            else {
                // If aborted, code is usually null or non-zero, but we already rejected.
                // Prevent unhandled rejection if already aborted.
                if (options?.signal?.aborted)
                    return;
                logger_1.logger.error({ code, stderr, args }, 'yt-dlp execution failed');
                reject(new Error(`yt-dlp failed with code ${code}: ${stderr}`));
            }
        });
    });
};
exports.runYtDlp = runYtDlp;
