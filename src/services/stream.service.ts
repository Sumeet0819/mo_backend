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
      // Fallback to any bestaudio or best if m4a is not available
      const url = await runYtDlp(['-g', '-f', 'bestaudio[ext=m4a]/bestaudio/best', videoId]);
      
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
