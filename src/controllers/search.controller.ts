import { Request, Response } from 'express';
import { SearchService } from '../services/search.service';
import { logger } from "../utils/logger";

export const search = async (req: Request, res: Response) => {
  const query = req.query.q as string;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

  if (!query) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  try {
    const results = await SearchService.search(query, limit);
    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error during search' });
  }
};
