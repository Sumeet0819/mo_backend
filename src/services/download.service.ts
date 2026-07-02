import { dbRun, dbAll, dbGet } from '../database/sqlite';
import crypto from 'crypto';
import { logger } from "../utils/logger";

export const activeDownloads = new Map<string, AbortController>();

export class DownloadService {
  static async enqueue(videoId: string) {
      logger.info(`[${'DownloadService'}.${'enqueue'}] called`);
    const jobId = crypto.randomUUID();
    await dbRun(
      'INSERT INTO download_queue (job_id, video_id, status) VALUES (?, ?, ?)',
      [jobId, videoId, 'PENDING']
    );
    return { jobId, status: 'PENDING' };
  }

  static async getQueue() {
      logger.info(`[${'DownloadService'}.${'getQueue'}] called`);
    return await dbAll('SELECT * FROM download_queue ORDER BY created_at DESC');
  }

  static async cancel(jobId: string) {
      logger.info(`[${'DownloadService'}.${'cancel'}] called`);
    const job = await dbGet('SELECT * FROM download_queue WHERE job_id = ?', [jobId]);
    if (!job) {
      throw new Error('Job not found');
    }
    
    // Abort the yt-dlp/ffmpeg process if it is running.
    const controller = activeDownloads.get(jobId);
    if (controller) {
      controller.abort();
      activeDownloads.delete(jobId);
    }

    await dbRun('DELETE FROM download_queue WHERE job_id = ?', [jobId]);
    return { success: true };
  }
}
