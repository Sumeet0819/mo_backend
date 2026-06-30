import { Router } from 'express';
import { enqueueDownload, getQueue, cancelDownload } from '../controllers/download.controller';

const router = Router();

router.post('/', enqueueDownload);
router.get('/queue', getQueue);
router.delete('/:jobId', cancelDownload);

export default router;
