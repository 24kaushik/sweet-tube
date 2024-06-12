import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});

const publishAVideo = asyncHandler(async (req, res) => {
  // TODO: get video, upload to cloudinary, create video
  // get video, thumbnail , title, desc
  // take pubsish (true/false)
  // upload to cloudinary
  // create db entry
  // return response
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
  //TODO: get video by id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: update video details like title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
