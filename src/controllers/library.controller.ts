import { Request, Response } from 'express';
import { LibraryService } from '../services/library.service';
import { logger } from "../utils/logger";

export const getSongs = async (req: Request, res: Response) => {
  try {
    const songs = await LibraryService.getSongs();
    res.json({ songs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await LibraryService.getHistory();
    res.json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await LibraryService.getPlaylists();
    res.json({ playlists });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
};

export const createPlaylist = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Playlist name is required' });
    return;
  }
  
  try {
    const playlist = await LibraryService.createPlaylist(name);
    res.status(201).json({ playlist });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create playlist' });
  }
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  const playlistId = req.params.playlistId as string;
  const { songId } = req.body;
  
  if (!songId) {
    res.status(400).json({ error: 'Song ID is required' });
    return;
  }
  
  try {
    const data = await LibraryService.addSongToPlaylist(playlistId, songId);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add song to playlist' });
  }
};

export const recordHistory = async (req: Request, res: Response) => {
  const { songId } = req.body;
  
  if (!songId) {
    res.status(400).json({ error: 'Song ID is required' });
    return;
  }
  
  try {
    const data = await LibraryService.recordHistory(songId);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record history' });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await LibraryService.getFavorites();
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  const { songId } = req.body;
  
  if (!songId) {
    res.status(400).json({ error: 'Song ID is required' });
    return;
  }
  
  try {
    const data = await LibraryService.addFavorite(songId);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  const songId = req.params.songId as string;
  
  try {
    await LibraryService.removeFavorite(songId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};
