"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExploreService = void 0;
const search_service_1 = require("./search.service");
const logger_1 = require("../utils/logger");
class ExploreService {
    static async getTrending(limit = 20) {
        logger_1.logger.info(`ExploreService.getTrending called with limit: ${limit}`);
        // Curated search query for trending music
        return await search_service_1.SearchService.search('Trending Music Hits 2026', limit);
    }
    static async getPodcasts(limit = 20) {
        logger_1.logger.info(`ExploreService.getPodcasts called with limit: ${limit}`);
        // Curated search query for popular video podcasts
        return await search_service_1.SearchService.search('Popular Video Podcasts full episodes', limit);
    }
    static async getNewReleases(limit = 20) {
        logger_1.logger.info(`ExploreService.getNewReleases called with limit: ${limit}`);
        // Curated search query for new music releases
        return await search_service_1.SearchService.search('New Music Releases This Week', limit);
    }
}
exports.ExploreService = ExploreService;
