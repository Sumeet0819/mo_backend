import { SearchService } from './search.service';

export class ExploreService {
  static async getTrending(limit: number = 20) {
    // Curated search query for trending music
    return await SearchService.search('Trending Music Hits 2026', limit);
  }

  static async getPodcasts(limit: number = 20) {
    // Curated search query for popular video podcasts
    return await SearchService.search('Popular Video Podcasts full episodes', limit);
  }

  static async getNewReleases(limit: number = 20) {
    // Curated search query for new music releases
    return await SearchService.search('New Music Releases This Week', limit);
  }
}
