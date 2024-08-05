import mongoose, { isValidObjectId } from "mongoose";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/Cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const imageLocalPath = req.file?.path;

  if (!content?.trim().length) {
    throw new ApiError(400, "Please send post content");
  }

  let image;

  if (imageLocalPath) {
    if (!req.file["mimetype"].split("/")[0] === "image") {
      throw new ApiError(400, "Please send an image file only");
    }

    image = await uploadOnCloudinary(imageLocalPath);
    if (!image.url) {
      throw new ApiError(500, "Failed to upload image on server");
    }
  }

  const post = await Post.create({
    owner: req.user._id,
    content: content.trim(),
    image: image?.url,
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
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "post",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "post",
        as: "comments",
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
        likesCount: {
          $size: "$likes",
        },
        commentsCount: {
          $size: "$comments",
        },
      },
    },
    {
      $project: {
        owner: 1,
        content: 1,
        image: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        commentsCount: 1,
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
  const imageLocalPath = req.file?.path;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Please provide a valid post id");
  }
  if (!newContent?.trim().length) {
    throw new ApiError(400, "New content is missing");
  }

  let image;

  if (imageLocalPath) {
    if (!req.file["mimetype"].split("/")[0] === "image") {
      throw new ApiError(400, "Please send an image file only");
    }

    image = await uploadOnCloudinary(imageLocalPath);
    if (!image.url) {
      throw new ApiError(500, "Failed to upload image on server");
    }
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "No post found with this id");
  }

  if (!post.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  post.content = newContent.trim();

  if (image?.url && post.image) {
    await deleteFromCloudinary(post.image);
  }

  post.image = image?.url;
  await post.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post updated successfully"));
});

const deletePost = asyncHandler(async (req, res) => {
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
  if (post.image) {
    await deleteFromCloudinary(post.image);
  }
  await Like.deleteMany({ post: postId });
  await Comment.deleteMany({ post: postId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});

export { createPost, getUserPosts, updatePost, deletePost };
