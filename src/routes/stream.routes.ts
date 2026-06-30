import { Router } from 'express';
import { streamAudio } from '../controllers/stream.controller';

const router = Router();

router.get('/:videoId', streamAudio);

export default router;
