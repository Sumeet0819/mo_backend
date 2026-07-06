"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeService = void 0;
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const supabase_1 = require("../database/supabase");
const logger_1 = require("../utils/logger");
const execPromise = util_1.default.promisify(child_process_1.exec);
class YoutubeService {
    static async syncPersonalFeed(feedType, cookiesPath) {
        logger_1.logger.info(`[YoutubeService.syncPersonalFeed] Syncing feed: ${feedType}`);
        // Command setup
        let cmd = `./yt-dlp --dump-json --flat-playlist`;
        if (cookiesPath) {
            cmd += ` --cookies ${cookiesPath}`;
        }
        else {
            cmd += ` --oauth2`;
        }
        // feedType should be something like :ytrec (recommendations), :ythistory (history), or :ytfav (liked videos)
        cmd += ` "${feedType}"`;
        try {
            // 50MB maxBuffer to handle large playlists
            const { stdout, stderr } = await execPromise(cmd, { maxBuffer: 1024 * 1024 * 50 });
            const lines = stdout.split('\n').filter(line => line.trim() !== '');
            const videosToUpsert = [];
            for (const line of lines) {
                try {
                    const video = JSON.parse(line);
                    videosToUpsert.push({
                        video_id: video.id,
                        title: video.title || null,
                        url: video.url || `https://www.youtube.com/watch?v=${video.id}`,
                        thumbnail_url: video.thumbnails?.[0]?.url || null,
                        duration: video.duration || 0,
                        view_count: video.view_count || 0,
                        uploader: video.uploader || null,
                        synced_at: new Date().toISOString()
                    });
                }
                catch (parseError) {
                    logger_1.logger.error(`[YoutubeService.syncChannel] Error parsing JSON line: ${parseError}`);
                }
            }
            if (videosToUpsert.length > 0 && supabase_1.supabase) {
                // Upsert in batches of 100 to avoid request size limits
                const batchSize = 100;
                for (let i = 0; i < videosToUpsert.length; i += batchSize) {
                    const batch = videosToUpsert.slice(i, i + batchSize);
                    const { error } = await supabase_1.supabase
                        .from('youtube_videos')
                        .upsert(batch, { onConflict: 'video_id' });
                    if (error) {
                        logger_1.logger.error(`[YoutubeService.syncChannel] Supabase upsert error: ${JSON.stringify(error)}`);
                        throw new Error('Failed to save batch to Supabase');
                    }
                }
            }
            return { success: true, count: videosToUpsert.length };
        }
        catch (err) {
            logger_1.logger.error(`[YoutubeService.syncChannel] Error executing yt-dlp: ${err.message}`);
            throw new Error(`yt-dlp sync failed: ${err.message}`);
        }
    }
    static async getVideos(limit = 50, offset = 0) {
        if (!supabase_1.supabase)
            throw new Error('Supabase client not initialized');
        const { data, error, count } = await supabase_1.supabase
            .from('youtube_videos')
            .select('*', { count: 'exact' })
            .order('synced_at', { ascending: false })
            .range(offset, offset + limit - 1);
        if (error) {
            logger_1.logger.error(`[YoutubeService.getVideos] Error: ${JSON.stringify(error)}`);
            throw new Error('Failed to fetch from Supabase');
        }
        return { data, count };
    }
}
exports.YoutubeService = YoutubeService;
