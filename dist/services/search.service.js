"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const ytdlp_1 = require("../utils/ytdlp");
const cache_1 = require("../cache");
const logger_1 = require("../utils/logger");
class SearchService {
    static async search(query, limit = 20) {
        const cacheKey = `search:${query}:${limit}`;
        const cached = cache_1.searchCache.get(cacheKey);
        if (cached) {
            logger_1.logger.info({ query }, 'Search cache hit');
            return cached;
        }
        logger_1.logger.info({ query }, 'Search cache miss, calling yt-dlp');
        try {
            // ytsearch<N>:query
            const stdout = await (0, ytdlp_1.runYtDlp)([`ytsearch${limit}:${query}`, '-j', '--flat-playlist', '--ignore-errors', '--no-abort-on-error']);
            // yt-dlp -j outputs JSON lines. We need to split by newline and parse each line.
            const lines = stdout.split('\n').filter(line => line.trim().length > 0);
            const results = lines.map(line => {
                const data = JSON.parse(line);
                return {
                    videoId: data.id,
                    title: data.title,
                    artist: data.uploader || data.channel,
                    duration: data.duration,
                    thumbnail: data.thumbnail || (data.thumbnails && data.thumbnails.length > 0 ? data.thumbnails[0].url : undefined)
                };
            });
            cache_1.searchCache.set(cacheKey, results);
            return results;
        }
        catch (error) {
            logger_1.logger.error({ err: error, query }, 'Search failed');
            throw new Error('Failed to perform search');
        }
    }
}
exports.SearchService = SearchService;
