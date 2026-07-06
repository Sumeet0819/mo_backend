"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YoutubeController = void 0;
const youtube_service_1 = require("../services/youtube.service");
const logger_1 = require("../utils/logger");
class YoutubeController {
    static async syncChannel(req, res) {
        try {
            const { feedType, cookiesPath } = req.body;
            if (!feedType) {
                res.status(400).json({ error: 'feedType is required (e.g., :ytrec, :ythistory, :ytfav)' });
                return;
            }
            const result = await youtube_service_1.YoutubeService.syncPersonalFeed(feedType, cookiesPath);
            res.status(200).json(result);
        }
        catch (error) {
            logger_1.logger.error(`[YoutubeController.syncChannel] Error: ${error.message}`);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
    static async getVideos(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 50;
            const offset = parseInt(req.query.offset) || 0;
            const result = await youtube_service_1.YoutubeService.getVideos(limit, offset);
            res.status(200).json(result);
        }
        catch (error) {
            logger_1.logger.error(`[YoutubeController.getVideos] Error: ${error.message}`);
            res.status(500).json({ error: error.message || 'Internal server error' });
        }
    }
}
exports.YoutubeController = YoutubeController;
