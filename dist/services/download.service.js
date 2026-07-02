"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadService = exports.activeDownloads = void 0;
const sqlite_1 = require("../database/sqlite");
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../utils/logger");
exports.activeDownloads = new Map();
class DownloadService {
    static async enqueue(videoId) {
        logger_1.logger.info(`[${'DownloadService'}.${'enqueue'}] called`);
        const jobId = crypto_1.default.randomUUID();
        await (0, sqlite_1.dbRun)('INSERT INTO download_queue (job_id, video_id, status) VALUES (?, ?, ?)', [jobId, videoId, 'PENDING']);
        return { jobId, status: 'PENDING' };
    }
    static async getQueue() {
        logger_1.logger.info(`[${'DownloadService'}.${'getQueue'}] called`);
        return await (0, sqlite_1.dbAll)('SELECT * FROM download_queue ORDER BY created_at DESC');
    }
    static async cancel(jobId) {
        logger_1.logger.info(`[${'DownloadService'}.${'cancel'}] called`);
        const job = await (0, sqlite_1.dbGet)('SELECT * FROM download_queue WHERE job_id = ?', [jobId]);
        if (!job) {
            throw new Error('Job not found');
        }
        // Abort the yt-dlp/ffmpeg process if it is running.
        const controller = exports.activeDownloads.get(jobId);
        if (controller) {
            controller.abort();
            exports.activeDownloads.delete(jobId);
        }
        await (0, sqlite_1.dbRun)('DELETE FROM download_queue WHERE job_id = ?', [jobId]);
        return { success: true };
    }
}
exports.DownloadService = DownloadService;
