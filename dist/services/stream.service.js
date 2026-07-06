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
            let url;
            try {
                // Strict format selector for iOS compatibility (m4a/mp4 only)
                url = await (0, ytdlp_1.runYtDlp)(['-g', '-f', 'bestaudio[ext=m4a]/m4a/best[ext=mp4]/best', videoId]);
            }
            catch (firstError) {
                logger_1.logger.warn({ videoId, err: firstError }, 'First extraction failed, trying without format selector');
                // Fallback attempt without any format selector, allowing yt-dlp to pick the default available format
                url = await (0, ytdlp_1.runYtDlp)(['-g', videoId]);
            }
            // yt-dlp might return multiple URLs (e.g., video and audio separately).
            // We take the last one, which is typically the audio stream if they are separated.
            const urls = url.split('\n').map(u => u.trim()).filter(u => u.length > 0);
            url = urls[urls.length - 1];
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
