import { dbRun, dbAll, dbGet } from '../database/sqlite';
import { v4 as uuidv4 } from 'uuid';

export const activeDownloads = new Map<string, AbortController>();

export class DownloadService {
  static async enqueue(videoId: string) {
    const jobId = uuidv4();
    await dbRun(
      'INSERT INTO download_queue (job_id, video_id, status) VALUES (?, ?, ?)',
      [jobId, videoId, 'PENDING']
    );
    return { jobId, status: 'PENDING' };
  }

  static async getQueue() {
    return await dbAll('SELECT * FROM download_queue ORDER BY created_at DESC');
  }

  static async cancel(jobId: string) {
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
