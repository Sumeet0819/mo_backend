"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelDownload = exports.getQueue = exports.enqueueDownload = void 0;
const download_service_1 = require("../services/download.service");
const enqueueDownload = async (req, res) => {
    const { videoId } = req.body;
    if (!videoId) {
        res.status(400).json({ error: 'videoId is required' });
        return;
    }
    try {
        const result = await download_service_1.DownloadService.enqueue(videoId);
        res.status(202).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to enqueue download' });
    }
};
exports.enqueueDownload = enqueueDownload;
const getQueue = async (req, res) => {
    try {
        const queue = await download_service_1.DownloadService.getQueue();
        res.json({ queue });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch queue' });
    }
};
exports.getQueue = getQueue;
const cancelDownload = async (req, res) => {
    const jobId = req.params.jobId;
    try {
        await download_service_1.DownloadService.cancel(jobId);
        res.json({ success: true });
    }
    catch (error) {
        if (error.message === 'Job not found') {
            res.status(404).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Failed to cancel download' });
    }
};
exports.cancelDownload = cancelDownload;
