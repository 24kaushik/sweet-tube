import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment
});

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    throw new ApiError(400, "Please provide a valid post id");
  }

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const likeObj = { post: postId, likedBy: req.user._id };

  const like = await Like.findOne(likeObj);
  if (like) {
    await Like.deleteOne(likeObj);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Liked removed successfully"));
  }

  await Like.create(likeObj);
  return res.status(200).json(new ApiResponse(200, {}, "Liked successfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
});

export { toggleCommentLike, togglePostLike, toggleVideoLike, getLikedVideos };
