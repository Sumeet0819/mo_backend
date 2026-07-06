"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runYtDlp = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logger_1 = require("./logger");
const binaryName = process.platform === 'win32' ? 'yt-dlp.exe' : 'yt-dlp';
const ytDlpPath = path_1.default.resolve(process.cwd(), binaryName);
const cookiesPath = path_1.default.resolve(process.cwd(), 'cookies.txt');
const cookiePathAlt = path_1.default.resolve(process.cwd(), 'cookie.txt');
const runYtDlp = (args, options) => {
    return new Promise((resolve, reject) => {
        // Use multiple player client fallbacks to bypass YouTube bot detection on datacenter IPs.
        // yt-dlp tries each client in order: android_vr → android → web
        const finalArgs = [
            ...args,
            '--no-warnings',
            '--force-ipv4',
            '--extractor-args', 'youtube:player_client=android_vr,android,web',
        ];
        // Append cookies as an optional enhancement if available
        const activeCookiePath = fs_1.default.existsSync(cookiesPath)
            ? cookiesPath
            : fs_1.default.existsSync(cookiePathAlt)
                ? cookiePathAlt
                : null;
        if (activeCookiePath) {
            finalArgs.push('--cookies', activeCookiePath);
        }
        const process = (0, child_process_1.spawn)(ytDlpPath, finalArgs);
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
                logger_1.logger.error({ code, stderr, finalArgs }, 'yt-dlp execution failed');
                reject(new Error(`yt-dlp failed with code ${code}: ${stderr}`));
            }
        });
    });
};
exports.runYtDlp = runYtDlp;
