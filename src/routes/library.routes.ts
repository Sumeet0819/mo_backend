import { Router } from 'express';
import { getSongs, getHistory, getPlaylists, createPlaylist, addSongToPlaylist, recordHistory, getFavorites, addFavorite, removeFavorite } from '../controllers/library.controller';

const router = Router();

router.get('/songs', getSongs);
router.get('/history', getHistory);
router.post('/history', recordHistory);
router.get('/favorites', getFavorites);
router.post('/favorites', addFavorite);
router.delete('/favorites/:songId', removeFavorite);
router.get('/playlists', getPlaylists);
router.post('/playlists', createPlaylist);
router.post('/playlists/:playlistId/songs', addSongToPlaylist);

export default router;
