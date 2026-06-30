import { supabase } from '../database/supabase';
import pino from 'pino';

const logger = pino();

export class LibraryService {
  static async getSongs() {
    if (!supabase) return [];
    
    const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
    if (error) {
      logger.error({ err: error }, 'Failed to fetch songs from Supabase');
      throw new Error('Failed to fetch songs');
    }
    return data;
  }

  static async getHistory() {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('history')
      .select('*, songs(*)')
      .order('played_at', { ascending: false });
      
    if (error) {
      logger.error({ err: error }, 'Failed to fetch history');
      throw new Error('Failed to fetch history');
    }
    return data;
  }

  static async getPlaylists() {
    if (!supabase) return [];

    const { data, error } = await supabase.from('playlists').select('*').order('created_at', { ascending: false });
    if (error) {
      logger.error({ err: error }, 'Failed to fetch playlists');
      throw new Error('Failed to fetch playlists');
    }
    return data;
  }

  static async createPlaylist(name: string) {
    if (!supabase) return null;

    const { data, error } = await supabase.from('playlists').insert([{ name }]).select().single();
    if (error) {
      logger.error({ err: error }, 'Failed to create playlist');
      throw new Error('Failed to create playlist');
    }
    return data;
  }

  static async addSongToPlaylist(playlistId: string, songId: string) {
    if (!supabase) return null;

    const { data, error } = await supabase.from('playlist_songs').insert([{ playlist_id: playlistId, song_id: songId }]).select().single();
    if (error) {
      logger.error({ err: error, playlistId, songId }, 'Failed to add song to playlist');
      throw new Error('Failed to add song to playlist');
    }
    return data;
  }

  static async recordHistory(songId: string) {
    if (!supabase) return null;

    const { data, error } = await supabase.from('history').insert([{ song_id: songId }]).select().single();
    if (error) {
      logger.error({ err: error, songId }, 'Failed to record history');
      throw new Error('Failed to record history');
    }
    return data;
  }

  static async getFavorites() {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('favorites')
      .select('*, songs(*)')
      .order('created_at', { ascending: false });
      
    if (error) {
      logger.error({ err: error }, 'Failed to fetch favorites');
      throw new Error('Failed to fetch favorites');
    }
    return data;
  }

  static async addFavorite(songId: string) {
    if (!supabase) return null;

    const { data, error } = await supabase.from('favorites').insert([{ song_id: songId }]).select().single();
    // Ignore error if it's already a favorite (unique constraint violation)
    if (error && error.code !== '23505') {
      logger.error({ err: error, songId }, 'Failed to add favorite');
      throw new Error('Failed to add favorite');
    }
    return data;
  }

  static async removeFavorite(songId: string) {
    if (!supabase) return null;

    const { error } = await supabase.from('favorites').delete().eq('song_id', songId);
    if (error) {
      logger.error({ err: error, songId }, 'Failed to remove favorite');
      throw new Error('Failed to remove favorite');
    }
    return { success: true };
  }
}
