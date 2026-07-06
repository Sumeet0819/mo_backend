import { exec } from 'child_process';
import util from 'util';
import { supabase } from '../database/supabase';
import { logger } from '../utils/logger';
import crypto from 'crypto';

const execPromise = util.promisify(exec);

export class YoutubeService {
  static async syncPersonalFeed(feedType: string, cookiesPath?: string) {
    logger.info(`[YoutubeService.syncPersonalFeed] Syncing feed: ${feedType}`);
    
    // Command setup
    let cmd = `./yt-dlp --dump-json --flat-playlist --ignore-errors --no-abort-on-error`;
    if (cookiesPath) {
      cmd += ` --cookies ${cookiesPath}`;
    } else {
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
        } catch (parseError) {
          logger.error(`[YoutubeService.syncChannel] Error parsing JSON line: ${parseError}`);
        }
      }

      if (videosToUpsert.length > 0 && supabase) {
        // Upsert in batches of 100 to avoid request size limits
        const batchSize = 100;
        for (let i = 0; i < videosToUpsert.length; i += batchSize) {
          const batch = videosToUpsert.slice(i, i + batchSize);
          const { error } = await supabase
            .from('youtube_videos')
            .upsert(batch, { onConflict: 'video_id' });
            
          if (error) {
            logger.error(`[YoutubeService.syncChannel] Supabase upsert error: ${JSON.stringify(error)}`);
            throw new Error('Failed to save batch to Supabase');
          }
        }
      }
      
      return { success: true, count: videosToUpsert.length };
    } catch (err: any) {
      logger.error(`[YoutubeService.syncChannel] Error executing yt-dlp: ${err.message}`);
      throw new Error(`yt-dlp sync failed: ${err.message}`);
    }
  }

  static async getVideos(limit = 50, offset = 0) {
    if (!supabase) throw new Error('Supabase client not initialized');
    
    const { data, error, count } = await supabase
      .from('youtube_videos')
      .select('*', { count: 'exact' })
      .order('synced_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error(`[YoutubeService.getVideos] Error: ${JSON.stringify(error)}`);
      throw new Error('Failed to fetch from Supabase');
    }

    return { data, count };
  }
}
