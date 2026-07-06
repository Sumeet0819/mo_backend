import { Request, Response } from 'express';
import { StreamService } from '../services/stream.service';
import { logger } from "../utils/logger";
export const streamAudio = async (req: Request, res: Response) => {
  const videoId = req.params.videoId as string;
  let retries = 1;

  while (retries >= 0) {
    try {
      const streamUrl = await StreamService.getStreamUrl(videoId);
      
      // Directly return the extracted YouTube URL to the client.
      // The frontend will be responsible for playing it natively.
      return res.status(200).json({ url: streamUrl });

    } catch (error: any) {
      if (error.response && error.response.status === 403 && retries > 0) {
        logger.warn({ videoId }, 'Stream URL expired (403). Invalidating cache and retrying...');
        StreamService.invalidateStreamUrl(videoId);
        retries--;
        continue;
      }
      
      logger.error({ err: error, videoId }, 'Failed to extract stream URL');
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to extract stream URL' });
      }
      break;
    }
  }
};
