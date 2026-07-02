"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const search_service_1 = require("../services/search.service");
const search = async (req, res) => {
    const query = req.query.q;
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
    if (!query) {
        res.status(400).json({ error: 'Query parameter "q" is required' });
        return;
    }
    try {
        const results = await search_service_1.SearchService.search(query, limit);
        res.json({ results });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error during search' });
    }
};
exports.search = search;
