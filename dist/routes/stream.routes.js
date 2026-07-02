"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stream_controller_1 = require("../controllers/stream.controller");
const router = (0, express_1.Router)();
router.get('/:videoId', stream_controller_1.streamAudio);
exports.default = router;
