"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewReleases = exports.getPodcasts = exports.getTrending = void 0;
const explore_service_1 = require("../services/explore.service");
const getTrending = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    try {
        const results = await explore_service_1.ExploreService.getTrending(limit);
        res.json({ results });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending music' });
    }
};
exports.getTrending = getTrending;
const getPodcasts = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    try {
        const results = await explore_service_1.ExploreService.getPodcasts(limit);
        res.json({ results });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch popular podcasts' });
    }
};
exports.getPodcasts = getPodcasts;
const getNewReleases = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    try {
        const results = await explore_service_1.ExploreService.getNewReleases(limit);
        res.json({ results });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch new releases' });
    }
};
exports.getNewReleases = getNewReleases;
