import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller.js";
import {optionalVerifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/stats/:channelId").get(getChannelStats);
router.route("/videos/:channelId").get(optionalVerifyJWT ,getChannelVideos);

export default router;
