import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino();

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
    }, `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
