"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamUrlCache = exports.searchCache = void 0;
const lru_cache_1 = require("lru-cache");
// Cache for search results (TTL: 24h)
exports.searchCache = new lru_cache_1.LRUCache({
    max: 500,
    ttl: 1000 * 60 * 60 * 24,
});
// Cache for resolved stream URLs (TTL: 2h)
exports.streamUrlCache = new lru_cache_1.LRUCache({
    max: 500,
    ttl: 1000 * 60 * 60 * 2,
});
