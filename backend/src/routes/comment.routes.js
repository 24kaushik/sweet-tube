import { Router } from "express";
import {
  addVideoComment,
  deleteComment,
  getVideoComments,
  updateComment,
  getPostComments,
  addPostComment,
} from "../controllers/comment.controller.js";
import {
  optionalVerifyJWT,
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/v/:videoId").get(optionalVerifyJWT, getVideoComments);
router.route("/p/:postId").get(optionalVerifyJWT, getPostComments);

// Secured Routes
router.route("/v/:videoId").post(verifyJWT, addVideoComment);
router.route("/p/:postId").post(verifyJWT, addPostComment);
router
  .route("/c/:commentId")
  .delete(verifyJWT, deleteComment)
  .patch(verifyJWT, updateComment);

export default router;
