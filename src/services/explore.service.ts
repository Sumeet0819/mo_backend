import { SearchService } from './search.service';
import { logger } from '../utils/logger';

export class ExploreService {
  static async getTrending(limit: number = 20) {
    logger.info(`ExploreService.getTrending called with limit: ${limit}`);
    // Curated search query for trending music
    return await SearchService.search('Trending Music Hits 2026', limit);
  }

  static async getPodcasts(limit: number = 20) {
    logger.info(`ExploreService.getPodcasts called with limit: ${limit}`);
    // Curated search query for popular video podcasts
    return await SearchService.search('Popular Video Podcasts full episodes', limit);
  }

  static async getNewReleases(limit: number = 20) {
    logger.info(`ExploreService.getNewReleases called with limit: ${limit}`);
    // Curated search query for new music releases
    return await SearchService.search('New Music Releases This Week', limit);
  }
}
