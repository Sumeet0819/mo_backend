"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFavorite = exports.addFavorite = exports.getFavorites = exports.recordHistory = exports.addSongToPlaylist = exports.createPlaylist = exports.getPlaylists = exports.getHistory = exports.getSongs = void 0;
const library_service_1 = require("../services/library.service");
const getSongs = async (req, res) => {
    try {
        const songs = await library_service_1.LibraryService.getSongs();
        res.json({ songs });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
};
exports.getSongs = getSongs;
const getHistory = async (req, res) => {
    try {
        const history = await library_service_1.LibraryService.getHistory();
        res.json({ history });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
exports.getHistory = getHistory;
const getPlaylists = async (req, res) => {
    try {
        const playlists = await library_service_1.LibraryService.getPlaylists();
        res.json({ playlists });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
};
exports.getPlaylists = getPlaylists;
const createPlaylist = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        res.status(400).json({ error: 'Playlist name is required' });
        return;
    }
    try {
        const playlist = await library_service_1.LibraryService.createPlaylist(name);
        res.status(201).json({ playlist });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create playlist' });
    }
};
exports.createPlaylist = createPlaylist;
const addSongToPlaylist = async (req, res) => {
    const playlistId = req.params.playlistId;
    const { songId } = req.body;
    if (!songId) {
        res.status(400).json({ error: 'Song ID is required' });
        return;
    }
    try {
        const data = await library_service_1.LibraryService.addSongToPlaylist(playlistId, songId);
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add song to playlist' });
    }
};
exports.addSongToPlaylist = addSongToPlaylist;
const recordHistory = async (req, res) => {
    const { songId } = req.body;
    if (!songId) {
        res.status(400).json({ error: 'Song ID is required' });
        return;
    }
    try {
        const data = await library_service_1.LibraryService.recordHistory(songId);
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to record history' });
    }
};
exports.recordHistory = recordHistory;
const getFavorites = async (req, res) => {
    try {
        const favorites = await library_service_1.LibraryService.getFavorites();
        res.json({ favorites });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
};
exports.getFavorites = getFavorites;
const addFavorite = async (req, res) => {
    const { songId } = req.body;
    if (!songId) {
        res.status(400).json({ error: 'Song ID is required' });
        return;
    }
    try {
        const data = await library_service_1.LibraryService.addFavorite(songId);
        res.status(201).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add favorite' });
    }
};
exports.addFavorite = addFavorite;
const removeFavorite = async (req, res) => {
    const songId = req.params.songId;
    try {
        await library_service_1.LibraryService.removeFavorite(songId);
        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
};
exports.removeFavorite = removeFavorite;
