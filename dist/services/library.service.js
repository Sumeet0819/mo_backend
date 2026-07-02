"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryService = void 0;
const supabase_1 = require("../database/supabase");
const logger_1 = require("../utils/logger");
class LibraryService {
    static async getSongs() {
        if (!supabase_1.supabase)
            return [];
        const { data, error } = await supabase_1.supabase.from('songs').select('*').order('created_at', { ascending: false });
        if (error) {
            logger_1.logger.error({ err: error }, 'Failed to fetch songs from Supabase');
            throw new Error('Failed to fetch songs');
        }
        return data;
    }
    static async getHistory() {
        if (!supabase_1.supabase)
            return [];
        const { data, error } = await supabase_1.supabase
            .from('history')
            .select('*, songs(*)')
            .order('played_at', { ascending: false });
        if (error) {
            logger_1.logger.error({ err: error }, 'Failed to fetch history');
            throw new Error('Failed to fetch history');
        }
        return data;
    }
    static async getPlaylists() {
        if (!supabase_1.supabase)
            return [];
        const { data, error } = await supabase_1.supabase.from('playlists').select('*').order('created_at', { ascending: false });
        if (error) {
            logger_1.logger.error({ err: error }, 'Failed to fetch playlists');
            throw new Error('Failed to fetch playlists');
        }
        return data;
    }
    static async createPlaylist(name) {
        if (!supabase_1.supabase)
            return null;
        const { data, error } = await supabase_1.supabase.from('playlists').insert([{ name }]).select().single();
        if (error) {
            logger_1.logger.error({ err: error }, 'Failed to create playlist');
            throw new Error('Failed to create playlist');
        }
        return data;
    }
    static async addSongToPlaylist(playlistId, songId) {
        if (!supabase_1.supabase)
            return null;
        const { data, error } = await supabase_1.supabase.from('playlist_songs').insert([{ playlist_id: playlistId, song_id: songId }]).select().single();
        if (error) {
            logger_1.logger.error({ err: error, playlistId, songId }, 'Failed to add song to playlist');
            throw new Error('Failed to add song to playlist');
        }
        return data;
    }
    static async recordHistory(songId) {
        if (!supabase_1.supabase)
            return null;
        const { data, error } = await supabase_1.supabase.from('history').insert([{ song_id: songId }]).select().single();
        if (error) {
            logger_1.logger.error({ err: error, songId }, 'Failed to record history');
            throw new Error('Failed to record history');
        }
        return data;
    }
    static async getFavorites() {
        if (!supabase_1.supabase)
            return [];
        const { data, error } = await supabase_1.supabase
            .from('favorites')
            .select('*, songs(*)')
            .order('created_at', { ascending: false });
        if (error) {
            logger_1.logger.error({ err: error }, 'Failed to fetch favorites');
            throw new Error('Failed to fetch favorites');
        }
        return data;
    }
    static async addFavorite(songId) {
        if (!supabase_1.supabase)
            return null;
        const { data, error } = await supabase_1.supabase.from('favorites').insert([{ song_id: songId }]).select().single();
        // Ignore error if it's already a favorite (unique constraint violation)
        if (error && error.code !== '23505') {
            logger_1.logger.error({ err: error, songId }, 'Failed to add favorite');
            throw new Error('Failed to add favorite');
        }
        return data;
    }
    static async removeFavorite(songId) {
        if (!supabase_1.supabase)
            return null;
        const { error } = await supabase_1.supabase.from('favorites').delete().eq('song_id', songId);
        if (error) {
            logger_1.logger.error({ err: error, songId }, 'Failed to remove favorite');
            throw new Error('Failed to remove favorite');
        }
        return { success: true };
    }
}
exports.LibraryService = LibraryService;
