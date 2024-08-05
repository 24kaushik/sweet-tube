import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Please provide a valid channel id");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "No channel found with this id");
  }

  let videos = await Video.find({ owner: channelId });
  videos = videos.filter((v) => v.isPublished);
  const subscribers = await Subscription.find({ channel: channelId });
  const likesCount = await videos.reduce(async (prev, video) => {
    const likes = await Like.find({ video: video._id });
    return prev + likes.length;
  }, 0);

  const stats = {
    totalViews: videos.reduce((prev, video) => prev + video.views, 0),
    totalVideos: videos.length,
    totalSubscribers: subscribers.length,
    totalLikes: likesCount,
  };

  return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const {  channelId  } = req.params;
  if  (!isValidObjectId(channelId))  {
    throw new ApiError(400, "Please provide a valid channel id");;
  }

  const channel = await User.findById(channelId);
  if  (!channel)  {
    throw new ApiError(404, "No channel found with this id");;
  }

  let videos = await Video.find({ owner: channelId });
  console.log(req.user?._id);
  if (!req.user?._id?.equals(channelId)) {
    videos = videos.filter((v) => v.isPublished);
  let videos = await Video.find({ owner: channelId });
  console.log(req.user?._id);
  if (!req.user?._id?.equals(channelId)) {
    videos = videos.filter((v) => v.isPublished);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
