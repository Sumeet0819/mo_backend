"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const explore_controller_1 = require("../controllers/explore.controller");
const router = (0, express_1.Router)();
router.get('/trending', explore_controller_1.getTrending);
router.get('/podcasts', explore_controller_1.getPodcasts);
router.get('/new', explore_controller_1.getNewReleases);
exports.default = router;
