import { runYtDlp } from '../utils/ytdlp';
import { streamUrlCache } from '../cache';
import pino from 'pino';

const logger = pino();

export class StreamService {
  static async getStreamUrl(videoId: string): Promise<string> {
    const cached = streamUrlCache.get(videoId);
    if (cached) {
      logger.info({ videoId }, 'Stream URL cache hit');
      return cached;
    }

    logger.info({ videoId }, 'Stream URL cache miss, calling yt-dlp');
    try {
      // yt-dlp -g -f bestaudio[ext=m4a] videoId
      const url = await runYtDlp(['-g', '-f', 'bestaudio[ext=m4a]', videoId]);
      
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
    streamUrlCache.delete(videoId);
  }
}
