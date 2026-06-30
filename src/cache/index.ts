import { LRUCache } from 'lru-cache';

// Cache for search results (TTL: 24h)
export const searchCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 60 * 24, 
});

// Cache for resolved stream URLs (TTL: 2h)
export const streamUrlCache = new LRUCache<string, string>({
  max: 500,
  ttl: 1000 * 60 * 60 * 2,
});
