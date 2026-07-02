"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamService = void 0;
const ytdlp_1 = require("../utils/ytdlp");
const cache_1 = require("../cache");
const logger_1 = require("../utils/logger");
class StreamService {
    static async getStreamUrl(videoId) {
        const cached = cache_1.streamUrlCache.get(videoId);
        if (cached) {
            logger_1.logger.info({ videoId }, 'Stream URL cache hit');
            return cached;
        }
        logger_1.logger.info({ videoId }, 'Stream URL cache miss, calling yt-dlp');
        try {
            // yt-dlp -g -f bestaudio[ext=m4a] videoId
            const url = await (0, ytdlp_1.runYtDlp)(['-g', '-f', 'bestaudio[ext=m4a]', videoId]);
            if (!url || !url.startsWith('http')) {
                throw new Error('Invalid URL returned from yt-dlp');
            }
            cache_1.streamUrlCache.set(videoId, url);
            return url;
        }
        catch (error) {
            logger_1.logger.error({ err: error, videoId }, 'Failed to get stream URL');
            throw new Error('Failed to extract stream URL');
        }
    }
    static invalidateStreamUrl(videoId) {
        logger_1.logger.info(`[${'StreamService'}.${'invalidateStreamUrl'}] called`);
        cache_1.streamUrlCache.delete(videoId);
    }
}
exports.StreamService = StreamService;
