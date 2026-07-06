import { runYtDlp } from '../utils/ytdlp';
import { streamUrlCache } from '../cache';
import { logger } from "../utils/logger";

export class StreamService {
  static async getStreamUrl(videoId: string): Promise<string> {
    const cached = streamUrlCache.get(videoId);
    if (cached) {
      logger.info({ videoId }, 'Stream URL cache hit');
      return cached;
    }

    logger.info({ videoId }, 'Stream URL cache miss, calling yt-dlp');
    try {
      let url: string;
      try {
        // Fallback to any bestaudio or best if m4a is not available
        url = await runYtDlp(['-g', '-f', 'ba/b', videoId]);
      } catch (firstError: any) {
        logger.warn({ videoId, err: firstError }, 'First extraction failed, trying without format selector');
        // Fallback attempt without any format selector, allowing yt-dlp to pick the default available format
        url = await runYtDlp(['-g', videoId]);
      }
      
      if (!url || !url.startsWith('http')) {
        throw new Error('Invalid URL returned from yt-dlp');
      }

      streamUrlCache.set(videoId, url);
      return url;
    } catch (error) {
      logger.error({ err: error, videoId }, 'Failed to get stream URL');
      throw new Error('Failed to extract stream URL');
    }
  }
  static invalidateStreamUrl(videoId: string) {
      logger.info(`[${'StreamService'}.${'invalidateStreamUrl'}] called`);
    streamUrlCache.delete(videoId);
  }
}
