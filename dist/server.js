"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const download_worker_1 = require("./workers/download.worker");
const PORT = env_1.env.PORT;
app_1.default.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
    // Start the background worker
    const worker = new download_worker_1.DownloadWorker();
    worker.start();
});
