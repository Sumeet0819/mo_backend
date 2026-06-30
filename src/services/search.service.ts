import { runYtDlp } from '../utils/ytdlp';
import { searchCache } from '../cache';
import pino from 'pino';

const logger = pino();

export class SearchService {
  static async search(query: string, limit: number = 20) {
    const cacheKey = `search:${query}:${limit}`;
    const cached = searchCache.get(cacheKey);

    if (cached) {
      logger.info({ query }, 'Search cache hit');
      return cached;
    }

    logger.info({ query }, 'Search cache miss, calling yt-dlp');
    try {
      // ytsearch<N>:query
      const stdout = await runYtDlp([`ytsearch${limit}:${query}`, '-j']);
      
      // yt-dlp -j outputs JSON lines. We need to split by newline and parse each line.
      const lines = stdout.split('\n').filter(line => line.trim().length > 0);
      const results = lines.map(line => {
        const data = JSON.parse(line);
        return {
          videoId: data.id,
          title: data.title,
          artist: data.uploader || data.channel,
          duration: data.duration,
          thumbnail: data.thumbnail
        };
      });

      searchCache.set(cacheKey, results);
      return results;
    } catch (error) {
      logger.error({ err: error, query }, 'Search failed');
      throw new Error('Failed to perform search');
    }
  }
}
