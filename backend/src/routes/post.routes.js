import { Router } from "express";
import {
  createPost,
  deletePost,
  getUserPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/user/:userId").get(getUserPosts);

//Secured Routes
router.route("/").post(verifyJWT, upload.single("image"), createPost);
router
  .route("/:postId")
  .patch(verifyJWT, upload.single("image"), updatePost)
  .delete(verifyJWT, deletePost);

export default router;
