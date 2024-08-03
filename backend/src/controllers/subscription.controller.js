import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Please provide a valid channel id");
  }

  const subscriber = await Subscription.findOne({
    subscriber: req.user._id,
    channel: channelId,
  });

  if (subscriber) {
    await Subscription.deleteOne({
      subscriber: req.user._id,
      channel: channelId,
    });
  } else {
    await Subscription.create({
      subscriber: req.user._id,
      channel: channelId,
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        `${subscriber ? "Unsubscribed" : "Subscribed"} successfully`
      )
    );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Please provide a valid channel id");
  }

  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriber",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
  ]);

  const subscribersArr = subscribers.map((e) => e.subscriber[0]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscribersArr, "Subscribers fetched successfully")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
