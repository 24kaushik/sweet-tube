import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  updateVideoThumbnail,
} from "../controllers/video.controller.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllVideos)
  .post(
    verifyJWT,
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishAVideo
  );

router.route("/:videoId").get(optionalVerifyJWT, getVideoById).delete(verifyJWT, deleteVideo)
.patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router
  .route("/thumbnail")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideoThumbnail);

router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
