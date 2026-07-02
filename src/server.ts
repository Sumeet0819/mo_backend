import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { DownloadWorker } from './workers/download.worker';
const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  
  // Start the background worker
  const worker = new DownloadWorker();
  worker.start();
});
