import { dbGet, dbRun } from '../database/sqlite';
import { runYtDlp } from '../utils/ytdlp';
import { env } from '../config/env';
import { activeDownloads } from '../services/download.service';
import { supabase } from '../database/supabase';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../utils/logger';

export class DownloadWorker {
  private isProcessing = false;

  constructor() {
    // Ensure temp and download dirs exist
    if (!fs.existsSync(env.TEMP_DIR)) fs.mkdirSync(env.TEMP_DIR, { recursive: true });
    if (!fs.existsSync(env.DOWNLOAD_DIR)) fs.mkdirSync(env.DOWNLOAD_DIR, { recursive: true });
  }

  start() {
    // Poll every 5 seconds
    setInterval(() => this.processNext(), 5000);
    logger.info('Download worker started');
  }

  private async processNext() {
    if (this.isProcessing) return;

    try {
      this.isProcessing = true;
      const job = await dbGet('SELECT * FROM download_queue WHERE status = ? ORDER BY created_at ASC LIMIT 1', ['PENDING']);

      if (!job) {
        this.isProcessing = false;
        return;
      }

      await this.processJob(job);
    } catch (error) {
      logger.error({ err: error }, 'Worker encountered an error');
    } finally {
      this.isProcessing = false;
    }
  }

  private async processJob(job: any) {
    logger.info({ jobId: job.job_id, videoId: job.video_id }, 'Processing job');
    const controller = new AbortController();
    activeDownloads.set(job.job_id, controller);

    try {
      await dbRun('UPDATE download_queue SET status = ? WHERE job_id = ?', ['DOWNLOADING', job.job_id]);

      // 1. Fetch metadata
      const infoStr = await runYtDlp(['-j', job.video_id], { signal: controller.signal });
      const info = JSON.parse(infoStr);

      const title = info.title;
      const artist = info.uploader || info.channel || 'Unknown Artist';
      const duration = info.duration || 0;
      const thumbnail = info.thumbnail || '';
      
      // 2. Download via yt-dlp
      await runYtDlp([
        job.video_id,
        '-f', 'bestaudio',
        '--extract-audio',
        '--audio-format', 'm4a',
        '-o', path.join(env.DOWNLOAD_DIR, '%(title)s.%(ext)s'),
        '--embed-thumbnail',
        '--add-metadata'
      ], {
        signal: controller.signal,
        onProgress: (progress) => {
          // Fire and forget progress update
          dbRun('UPDATE download_queue SET progress = ? WHERE job_id = ?', [Math.round(progress), job.job_id]).catch(() => {});
        }
      });

      // 3. Push metadata to Supabase
      if (supabase) {
        const { error } = await supabase.from('songs').insert([{
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

      await dbRun('UPDATE download_queue SET status = ?, progress = 100 WHERE job_id = ?', ['COMPLETED', job.job_id]);
      logger.info({ jobId: job.job_id }, 'Job completed successfully');

    } catch (error: any) {
      if (error.message === 'Aborted') {
        logger.info({ jobId: job.job_id }, 'Job was aborted/cancelled');
      } else {
        logger.error({ err: error, jobId: job.job_id }, 'Job failed');
        await dbRun('UPDATE download_queue SET status = ?, error_message = ? WHERE job_id = ?', ['FAILED', error.message, job.job_id]);
      }
    } finally {
      activeDownloads.delete(job.job_id);
    }
  }
}
