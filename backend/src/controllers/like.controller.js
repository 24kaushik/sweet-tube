import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Post } from "../models/post.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please provide a valid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const likeObj = { video: videoId, likedBy: req.user._id };

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

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Please provide a valid comment id");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const likeObj = { comment: commentId, likedBy: req.user._id };

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

const togglePostLike = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  if (!isValidObjectId(postId)) {
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
  const { page = 1, limit = 10 } = req.query;
  const pageOptions = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const likes = await Like.find({ likedBy: req.user._id });
  if (!likes?.length) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "Liked videos fetched successfully"));
  }

  const videoIdArray = [];
  likes.forEach((e) => {
    videoIdArray.push(e.video);
  });

  const likedVideos = Video.aggregate([
    {
      $match: {
        _id: {
          $in: videoIdArray,
        },
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
              fullName: 1,
              username: 1,
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
  const paginatedData = await Video.aggregatePaginate(likedVideos, pageOptions);

  return res
    .status(200)
    .json(
      new ApiResponse(200, paginatedData, "Liked videos fetched successfully")
    );
});

//TODO: a route to verify like

export { toggleCommentLike, togglePostLike, toggleVideoLike, getLikedVideos };
