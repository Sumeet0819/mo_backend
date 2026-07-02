"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAudio = void 0;
const stream_service_1 = require("../services/stream.service");
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../utils/logger");
const streamAudio = async (req, res) => {
    const videoId = req.params.videoId;
    let retries = 1;
    while (retries >= 0) {
        try {
            const streamUrl = await stream_service_1.StreamService.getStreamUrl(videoId);
            const range = req.headers.range;
            const axiosConfig = {
                method: 'GET',
                url: streamUrl,
                responseType: 'stream',
                headers: {}
            };
            if (range) {
                axiosConfig.headers['Range'] = range;
            }
            const response = await (0, axios_1.default)(axiosConfig);
            // Forward the headers from YouTube to the client
            res.writeHead(response.status, response.headers);
            // Pipe the audio stream
            response.data.pipe(res);
            response.data.on('error', (err) => {
                logger_1.logger.error({ err, videoId }, 'Stream error');
                if (!res.headersSent) {
                    res.status(500).end();
                }
            });
            return; // Success, exit loop
        }
        catch (error) {
            if (error.response && error.response.status === 403 && retries > 0) {
                logger_1.logger.warn({ videoId }, 'Stream URL expired (403). Invalidating cache and retrying...');
                stream_service_1.StreamService.invalidateStreamUrl(videoId);
                retries--;
                continue;
            }
            logger_1.logger.error({ err: error, videoId }, 'Failed to stream audio');
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to stream audio' });
            }
            break;
        }
    }
};
exports.streamAudio = streamAudio;
