import { Request, Response } from 'express';
import { YoutubeService } from '../services/youtube.service';
import { logger } from '../utils/logger';

export class YoutubeController {
  static async syncChannel(req: Request, res: Response): Promise<void> {
    try {
      const { feedType, cookiesPath } = req.body;
      if (!feedType) {
        res.status(400).json({ error: 'feedType is required (e.g., :ytrec, :ythistory, :ytfav)' });
        return;
      }
      
      const result = await YoutubeService.syncPersonalFeed(feedType, cookiesPath);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`[YoutubeController.syncChannel] Error: ${error.message}`);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getVideos(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const result = await YoutubeService.getVideos(limit, offset);
      res.status(200).json(result);
    } catch (error: any) {
      logger.error(`[YoutubeController.getVideos] Error: ${error.message}`);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}
