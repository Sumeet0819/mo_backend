"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadWorker = void 0;
const sqlite_1 = require("../database/sqlite");
const ytdlp_1 = require("../utils/ytdlp");
const env_1 = require("../config/env");
const download_service_1 = require("../services/download.service");
const supabase_1 = require("../database/supabase");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class DownloadWorker {
    isProcessing = false;
    constructor() {
        // Ensure temp and download dirs exist
        if (!fs_1.default.existsSync(env_1.env.TEMP_DIR))
            fs_1.default.mkdirSync(env_1.env.TEMP_DIR, { recursive: true });
        if (!fs_1.default.existsSync(env_1.env.DOWNLOAD_DIR))
            fs_1.default.mkdirSync(env_1.env.DOWNLOAD_DIR, { recursive: true });
    }
    start() {
        // Poll every 5 seconds
        setInterval(() => this.processNext(), 5000);
        logger.info('Download worker started');
    }
    async processNext() {
        if (this.isProcessing)
            return;
        try {
            this.isProcessing = true;
            const job = await (0, sqlite_1.dbGet)('SELECT * FROM download_queue WHERE status = ? ORDER BY created_at ASC LIMIT 1', ['PENDING']);
            if (!job) {
                this.isProcessing = false;
                return;
            }
            await this.processJob(job);
        }
        catch (error) {
            logger.error({ err: error }, 'Worker encountered an error');
        }
        finally {
            this.isProcessing = false;
        }
    }
    async processJob(job) {
        logger.info({ jobId: job.job_id, videoId: job.video_id }, 'Processing job');
        const controller = new AbortController();
        download_service_1.activeDownloads.set(job.job_id, controller);
        try {
            await (0, sqlite_1.dbRun)('UPDATE download_queue SET status = ? WHERE job_id = ?', ['DOWNLOADING', job.job_id]);
            // 1. Fetch metadata
            const infoStr = await (0, ytdlp_1.runYtDlp)(['-j', job.video_id], { signal: controller.signal });
            const info = JSON.parse(infoStr);
            const title = info.title;
            const artist = info.uploader || info.channel || 'Unknown Artist';
            const duration = info.duration || 0;
            const thumbnail = info.thumbnail || '';
            // 2. Download via yt-dlp
            await (0, ytdlp_1.runYtDlp)([
                job.video_id,
                '-f', 'bestaudio',
                '--extract-audio',
                '--audio-format', 'm4a',
                '-o', path_1.default.join(env_1.env.DOWNLOAD_DIR, '%(title)s.%(ext)s'),
                '--embed-thumbnail',
                '--add-metadata'
            ], {
                signal: controller.signal,
                onProgress: (progress) => {
                    // Fire and forget progress update
                    (0, sqlite_1.dbRun)('UPDATE download_queue SET progress = ? WHERE job_id = ?', [Math.round(progress), job.job_id]).catch(() => { });
                }
            });
            // 3. Push metadata to Supabase
            if (supabase_1.supabase) {
                const { error } = await supabase_1.supabase.from('songs').insert([{
                        video_id: job.video_id,
                        title,
                        artist,
                        duration,
                        thumbnail
                    }]);
                if (error && error.code !== '23505') { // Ignore unique constraint violation if already exists
                    logger.error({ err: error, videoId: job.video_id }, 'Failed to insert song into Supabase');
                }
            }
            await (0, sqlite_1.dbRun)('UPDATE download_queue SET status = ?, progress = 100 WHERE job_id = ?', ['COMPLETED', job.job_id]);
            logger.info({ jobId: job.job_id }, 'Job completed successfully');
        }
        catch (error) {
            if (error.message === 'Aborted') {
                logger.info({ jobId: job.job_id }, 'Job was aborted/cancelled');
            }
            else {
                logger.error({ err: error, jobId: job.job_id }, 'Job failed');
                await (0, sqlite_1.dbRun)('UPDATE download_queue SET status = ?, error_message = ? WHERE job_id = ?', ['FAILED', error.message, job.job_id]);
            }
        }
        finally {
            download_service_1.activeDownloads.delete(job.job_id);
        }
    }
}
exports.DownloadWorker = DownloadWorker;
