import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPost = asyncHandler(async (req, res) => {
  // TODO allow users to post image too
  const { content } = req.body;

  if (!content?.trim().length) {
    throw new ApiError(400, "Please send post content");
  }

  const post = await Post.create({
    owner: req.user._id,
    content: content.trim(),
  });

  if (!post) {
    throw new ApiError(500, "Error creating a new post");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, post, "Post created successfully"));
});

const getUserPosts = asyncHandler(async (req, res) => {
  // TODO: Paginate
  // TODO send likes and comments too

  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Please provide a valid user id");
  }

  const posts = await Post.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!posts.length) {
    throw new ApiError(404, "No posts found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const updatePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { newContent } = req.body;

  if(!isValidObjectId(postId)){
    throw new ApiError(400, "Please provide a valid post id");
  }
  if (!newContent?.trim().length) {
    throw new ApiError(400, "New content is missing");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "No post found with this id");
  }

  if (!post.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  post.content = newContent.trim();
  await post.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
  // TODO delete all its likes and comments
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Please provide a valid post id");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "No post found with this id");
  }
  if (!post.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  await Post.findByIdAndDelete(postId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getUserPosts, updatePost, deletePost,  };
