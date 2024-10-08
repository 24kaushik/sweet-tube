import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/Cloudinary.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  const pageOptions = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  const match = { isPublished: true };
  if (query) {
    match.title = { $regex: new RegExp(query, "i") };
  }

  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Please provide a valid user id");
    }
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  const sortOptions = {};
  if (sortBy === "createdAt") {
    sortOptions.createdAt = sortType === "asc" ? 1 : -1;
  } else {
    sortOptions["views"] = sortType === "asc" ? 1 : -1;
  }

  const videos = Video.aggregate([
    {
      $match: match,
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
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: { $first: "$owner" },
      },
    },
    {
      $sort: sortOptions,
    },
  ]);
  const paginatedData = await Video.aggregatePaginate(videos, pageOptions);

  return res
    .status(200)
    .json(new ApiResponse(200, paginatedData, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const videoLocalPath = req.files?.videoFile[0]?.path;
  if (!videoLocalPath) {
    throw new ApiError(400, "Video is missing");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is missing");
  }

  if (!req.files.videoFile[0]["mimetype"].split("/")[0] === "image") {
    throw new ApiError(
      400,
      "Please send only a video file in videoFile property"
    );
  }

  if (!req.files.thumbnail[0]["mimetype"].split("/")[0] === "image") {
    throw new ApiError(
      400,
      "Please send only a image file in thumbnail property"
    );
  }

  const { title, description, publish = true } = req.body;
  if (!title?.trim().length) {
    throw new ApiError(400, "Title is missing");
  }
  if (!description?.trim().length) {
    throw new ApiError(400, "Description is missing");
  }

  const uploadedVideo = await uploadOnCloudinary(videoLocalPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!uploadedVideo) {
    throw new ApiError(500, "Could not upload video");
  }
  if (!uploadedThumbnail) {
    throw new ApiError(500, "Could not upload thumbnail");
  }

  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    title: title.trim(),
    description: description.trim(),
    duration: uploadedVideo.duration,
    isPublished: publish ? true : false,
    owner: req.user._id,
  });

  if (!video) {
    throw new ApiError(500, "Error creating entry in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video uploaded successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please send a valid video id");
  }
  const video = await Video.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
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
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "channel",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: {
                $size: "$subscribers",
              },
            },
          },
          {
            $project: {
              username: 1,
              fullName: 1,
              subscribersCount: 1,
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
        foreignField: "video",
        as: "likes",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "userHasLiked",
        pipeline: [
          {
            $match: {
              likedBy: req.user?._id,
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
        likesCount: {
          $size: "$likes",
        },
        commentsCount: {
          $size: "$comments",
        },
        userHasLiked: {
          $cond: {
            if: { $gt: [{ $size: "$userHasLiked" }, 0] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        likes: 0,
        comments: 0,
      },
    },
  ]);
  if (!video.length) {
    throw new ApiError(404, "Video not found");
  }

  if (!video[0].isPublished && !video[0].owner._id.equals(req.user?._id)) {
    throw new ApiError(401, "This video is private");
  }
  await Video.findByIdAndUpdate(videoId, { views: video[0].views + 1 });

  if (isValidObjectId(req.user?._id)) {
    const user = await User.findById(req.user?._id);

    if (user) {
      const subscriber = await Subscription.findOne({
        subscriber: user._id,
        channel: video[0].owner._id,
      });
      video[0].userHasSubscribed = Boolean(subscriber);

      if (!user.watchHistory[0]?.equals(videoId)) {
        user.watchHistory = [...user.watchHistory, videoId];
        user.save({ validateBeforeSave: false });
      }
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, video[0], "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  if (!title?.trim().length) {
    throw new ApiError(400, "Please send title");
  }
  if (!description?.trim().length) {
    throw new ApiError(400, "Please send description");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please send a valid video id`");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized request");
  }

  video.title = title.trim();
  video.description = description.trim();

  await video.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {}, "Video updated successfully"));
});

const updateVideoThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailLocalPath = req.file?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Please send a thumbnail file");
  }
  if (!req.file["mimetype"].split("/")[0] === "image") {
    throw new ApiError(
      400,
      "Please send only a image file in thumbnail property"
    );
  }
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please send a valid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video does not exists");
  }
  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!uploadedThumbnail) {
    throw new ApiError(500, "Error uploading thumbnail");
  }

  await deleteFromCloudinary(video.thumbnail);
  video.thumbnail = uploadedThumbnail.url;
  await video.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Thumbnail updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please send a valid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video does not exists");
  }

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  await deleteFromCloudinary(video.videoFile);
  await deleteFromCloudinary(video.thumbnail);
  await Video.findByIdAndDelete(videoId);
  await Like.deleteMany({ video: videoId });
  await Comment.deleteMany({ video: videoId });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Please send a valid video id");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video does not exists");
  }

  if (!video.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { isPublished: video.isPublished },
        "Publish status toggled"
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  updateVideoThumbnail,
};
