"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamAudio = void 0;
const stream_service_1 = require("../services/stream.service");
const logger_1 = require("../utils/logger");
const streamAudio = async (req, res) => {
    const videoId = req.params.videoId;
    let retries = 1;
    while (retries >= 0) {
        try {
            const streamUrl = await stream_service_1.StreamService.getStreamUrl(videoId);
            // Directly return the extracted YouTube URL to the client.
            // The frontend will be responsible for playing it natively.
            return res.status(200).json({ url: streamUrl });
        }
        catch (error) {
            if (error.response && error.response.status === 403 && retries > 0) {
                logger_1.logger.warn({ videoId }, 'Stream URL expired (403). Invalidating cache and retrying...');
                stream_service_1.StreamService.invalidateStreamUrl(videoId);
                retries--;
                continue;
            }
            logger_1.logger.error({ err: error, videoId }, 'Failed to extract stream URL');
            if (!res.headersSent) {
                res.status(500).json({ error: 'Failed to extract stream URL' });
            }
            break;
        }
    }
};
exports.streamAudio = streamAudio;
