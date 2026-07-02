"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const download_controller_1 = require("../controllers/download.controller");
const router = (0, express_1.Router)();
router.post('/', download_controller_1.enqueueDownload);
router.get('/queue', download_controller_1.getQueue);
router.delete('/:jobId', download_controller_1.cancelDownload);
exports.default = router;
