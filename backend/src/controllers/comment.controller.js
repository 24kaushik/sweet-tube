import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageOptions = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid video id");
  }

  const comments = Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
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
              _id: 1,
              username: 1,
              fullname: 1,
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
        foreignField: "comment",
        as: "likes",
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
        isOwner: {
          $eq: [req.user?._id, { $first: "$owner._id" }],
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        isOwner: 1,
      },
    },
  ]);
  const paginatedData = await Comment.aggregatePaginate(comments, pageOptions);

  res
    .status(200)
    .json(new ApiResponse(200, paginatedData, "Comments fetched successfully"));
});

const addVideoComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid video id");
  }

  if (!content?.trim().length) {
    throw new ApiError(400, "Please send content");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video does not exists");
  }

  await Comment.create({
    content: content.trim(),
    video: videoId,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment created successfully"));
});

const addPostComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Please provide a valid post id");
  }

  if (!content?.trim().length) {
    throw new ApiError(400, "Please send content");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(404, "Post does not exists");
  }

  await Comment.create({
    content: content.trim(),
    post: postId,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { newContent } = req.body;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment id");
  }

  if (!newContent?.trim().length) {
    throw new ApiError(400, "Please send new content");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "No comment found with this id");
  }

  comment.content = newContent.trim();
  await comment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment id");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "No comment found with this id");
  }

  if (!comment.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  await Comment.findByIdAndDelete(commentId);
  await Like.deleteMany({ comment: commentId });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const getPostComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const pageOptions = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  if (!isValidObjectId(postId)) {
    throw new ApiError(400, "Please provide a valid post id");
  }

  const comments = Comment.aggregate([
    {
      $match: {
        post: new mongoose.Types.ObjectId(postId),
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
              _id: 1,
              username: 1,
              fullname: 1,
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
        foreignField: "comment",
        as: "likes",
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
        isOwner: {
          $eq: [req.user?._id, { $first: "$owner._id" }],
        },
      },
    },
    {
      $project: {
        content: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        isOwner: 1,
      },
    },
  ]);
  const paginatedData = await Comment.aggregatePaginate(comments, pageOptions);

  res
    .status(200)
    .json(new ApiResponse(200, paginatedData, "Comments fetched successfully"));
});

export {
  getVideoComments,
  addVideoComment,
  updateComment,
  deleteComment,
  getPostComments,
  addPostComment,
};
