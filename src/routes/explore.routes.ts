import { Router } from 'express';
import { getTrending, getPodcasts, getNewReleases } from '../controllers/explore.controller';

const router = Router();

router.get('/trending', getTrending);
router.get('/podcasts', getPodcasts);
router.get('/new', getNewReleases);

export default router;
