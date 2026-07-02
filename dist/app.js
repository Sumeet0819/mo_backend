"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
const search_routes_1 = __importDefault(require("./routes/search.routes"));
const stream_routes_1 = __importDefault(require("./routes/stream.routes"));
const download_routes_1 = __importDefault(require("./routes/download.routes"));
const library_routes_1 = __importDefault(require("./routes/library.routes"));
const logger_middleware_1 = require("./middleware/logger.middleware");
const explore_routes_1 = __importDefault(require("./routes/explore.routes"));
const app = (0, express_1.default)();
// Middleware
app.use(logger_middleware_1.requestLogger);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/v1/health', health_routes_1.default);
app.use('/api/v1/search', search_routes_1.default);
app.use('/api/v1/explore', explore_routes_1.default);
app.use('/api/v1/stream', stream_routes_1.default);
app.use('/api/v1/downloads', download_routes_1.default);
app.use('/api/v1/library', library_routes_1.default);
// Error Handling (basic)
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});
exports.default = app;
