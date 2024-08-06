import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim().length || !description?.trim().length) {
    throw new ApiError(400, "Please send a Name and Description");
  }

  const data = {
    name: name.trim(),
    description: description.trim(),
    owner: req.user._id,
  };

  const playlist = await Playlist.create(data);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist created successfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id });
  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: use aggregation pipelines and replace video ids with actual video objects
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Please provide a valid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "No playlist found with this id");
  }
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(401, "You are not the owner of this playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  //TODO
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  // TODO: delete playlist
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
