import { Router } from 'express';
import { YoutubeController } from '../controllers/youtube.controller';

const router = Router();

router.post('/sync', YoutubeController.syncChannel);
router.get('/videos', YoutubeController.getVideos);

export default router;
