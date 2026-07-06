"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const youtube_controller_1 = require("../controllers/youtube.controller");
const router = (0, express_1.Router)();
router.post('/sync', youtube_controller_1.YoutubeController.syncChannel);
router.get('/videos', youtube_controller_1.YoutubeController.getVideos);
exports.default = router;
