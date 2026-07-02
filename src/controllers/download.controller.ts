import { Request, Response } from 'express';
import { DownloadService } from '../services/download.service';
import { logger } from "../utils/logger";

export const enqueueDownload = async (req: Request, res: Response) => {
  const { videoId } = req.body;
  if (!videoId) {
    res.status(400).json({ error: 'videoId is required' });
    return;
  }

  try {
    const result = await DownloadService.enqueue(videoId);
    res.status(202).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enqueue download' });
  }
};

export const getQueue = async (req: Request, res: Response) => {
  try {
    const queue = await DownloadService.getQueue();
    res.json({ queue });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queue' });
  }
};

export const cancelDownload = async (req: Request, res: Response) => {
  const jobId = req.params.jobId as string;
  try {
    await DownloadService.cancel(jobId);
    res.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Job not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Failed to cancel download' });
  }
};
