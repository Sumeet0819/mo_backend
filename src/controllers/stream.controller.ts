import { Request, Response } from 'express';
import { StreamService } from '../services/stream.service';
import axios from 'axios';
import { logger } from "../utils/logger";
export const streamAudio = async (req: Request, res: Response) => {
  const videoId = req.params.videoId as string;
  let retries = 1;

  while (retries >= 0) {
    try {
      const streamUrl = await StreamService.getStreamUrl(videoId);
      
      const range = req.headers.range;
      const axiosConfig: any = {
        method: 'GET',
        url: streamUrl,
        responseType: 'stream',
        headers: {}
      };

      if (range) {
        axiosConfig.headers['Range'] = range;
      }

      const response = await axios(axiosConfig);

      // Forward the headers from YouTube to the client
      res.writeHead(response.status, response.headers as any);
      
      // Pipe the audio stream
      response.data.pipe(res);

      response.data.on('error', (err: any) => {
        logger.error({ err, videoId }, 'Stream error');
        if (!res.headersSent) {
          res.status(500).end();
        }
      });
      
      return; // Success, exit loop

    } catch (error: any) {
      if (error.response && error.response.status === 403 && retries > 0) {
        logger.warn({ videoId }, 'Stream URL expired (403). Invalidating cache and retrying...');
        StreamService.invalidateStreamUrl(videoId);
        retries--;
        continue;
      }
      
      logger.error({ err: error, videoId }, 'Failed to stream audio');
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to stream audio' });
      }
      break;
    }
  }
};
