import { Request, Response } from 'express';
import { ExploreService } from '../services/explore.service';

export const getTrending = async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  try {
    const results = await ExploreService.getTrending(limit);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending music' });
  }
};

export const getPodcasts = async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  try {
    const results = await ExploreService.getPodcasts(limit);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch popular podcasts' });
  }
};

export const getNewReleases = async (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  try {
    const results = await ExploreService.getNewReleases(limit);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
};
