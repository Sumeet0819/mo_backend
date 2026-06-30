import app from './app';
import { env } from './config/env';
import { DownloadWorker } from './workers/download.worker';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // Start the background worker
  const worker = new DownloadWorker();
  worker.start();
});
