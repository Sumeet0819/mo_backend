import { Request, Response } from 'express';
import { logger } from "../utils/logger";

export const getHealthStatus = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};
