import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content?.trim().length) {
    throw new ApiError(400, "Please send tweet content");
  }

  const tweet = await Tweet.create({
    owner: req.user._id,
    content: content.trim(),
  });

  if (!tweet) {
    throw new ApiError(500, "Error creating a new tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: Paginate
  // TODO send likes and comments too

  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "Please provide user id");
  }

  const tweets = await Tweet.aggregate([
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

  if (!tweets) {
    throw new ApiError(404, "No tweets found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { newContent } = req.body;

  if (!tweetId?.trim().length || !newContent?.trim().length) {
    throw new ApiError(400, "Tweet id or new content is missing");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "No tweet found with this id");
  }

  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  tweet.content = newContent.trim();
  await tweet.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  // TODO delete all its likes and comments
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Please provide a tweet id");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "No tweet found with this id");
  }
  if (!tweet.owner.equals(req.user._id)) {
    throw new ApiError(401, "Unauthorized access");
  }

  await Tweet.findByIdAndDelete(tweetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

const getAllTweets = asyncHandler(async (req, res) => {
  // TODO paginate, send likes and comments too
  // TODO send relevant tweets

  const tweets = await Tweet.aggregate([
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

  return res
    .status(200)
    .json(new ApiResponse(200, tweets, "Tweets retrieved successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet, getAllTweets };
