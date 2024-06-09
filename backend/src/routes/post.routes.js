import { Router } from "express";
import {
  createPost,
  deletePost,
  getUserPosts,
  updatePost,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/user/:userId").get(getUserPosts);

//Secured Routes
router.route("/").post(verifyJWT, createPost);
router.route("/:postId").patch(verifyJWT, updatePost).delete(verifyJWT, deletePost);

export default router;
