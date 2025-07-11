import HTTP from '../constants/status.js';
import { getUser } from '../services/user.service.js';
import * as UserPhotoServices from '../services/userPhoto.service.js';

export const handleUploadPhotos = async (req, res, next) => {
  try {
    const photos = await UserPhotoServices.uploadUserPhotos(req.user.id, req.files);
    res.status(HTTP.StatusCodes.OK).json({ photos });
  } catch (err) {
    next(err);
  }
};

export const handleUploadProfilePhoto = async (req, res, next) => {
  try {
    const profile = await UserPhotoServices.uploadProfilePhoto(req.user.id, req.file);
    res.status(HTTP.StatusCodes.OK).json({ profile });
  } catch (err) {
    next(err);
  }
};

export const handleUploadReel = async (req, res, next) => {
  try {
    const reels = await UserPhotoServices.uploadUserReel(req.user.id, req.file, req.body.tripId, req.body.firstComment);
    res.status(HTTP.StatusCodes.OK).json({ reels });
  } catch (err) {
    next(err);
  }
};

export const handleDeletePhoto = async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.body.publicId);
    const photos = await UserPhotoServices.deleteGalleryPhoto(req.user.id, publicId);
    res.status(HTTP.StatusCodes.OK).json({ photos });
  } catch (err) {
    next(err);
  }
};

export const handleDeleteReel = async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.query.publicId);
    const reels = await UserPhotoServices.deleteGalleryReel(req.user.id, publicId);
    res.status(HTTP.StatusCodes.OK).json({ reels });
  } catch (err) {
    next(err);
  }
};

export const getAllReels = async (req, res, next) => {
  try {
    const reels = await UserPhotoServices.getAllReels(req.user.id);
    res.status(HTTP.StatusCodes.OK).json({ reels });
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req, res, next) => {
  const { reelId, text } = req.body;
  const userId = req.user.id;
  try {
    const updatedUser = await UserPhotoServices.addComment(userId, reelId, text);
    res.status(HTTP.StatusCodes.OK).json({ updatedUser });
  } catch (error) {
    next(error)
  }
};

export const addLike = async (req, res, next) => {
  const { reelId } = req.body;
  const userId = req.user.id;
  try {
    const updatedUser = await UserPhotoServices.addLike(userId, reelId);
    res.status(HTTP.StatusCodes.OK).json({ updatedUser });
  } catch (error) {
    next(error);
  }
};

export const removeLike = async (req, res, next) => {
  const { reelId } = req.body;
  const userId = req.user.id;
  try {
    const updatedUser = await UserPhotoServices.removeLike(userId, reelId);
    res.status(HTTP.StatusCodes.OK).json({ updatedUser });
  } catch (error) {
    next(error)
  }
};

export const getReelLikesCount = async (req, res, next) => {
  const { reelId } = req.params;
  try {
    const count = await UserPhotoServices.getReelLikesCount(reelId);
    res.status(HTTP.StatusCodes.OK).json({ likesCount: count });
  } catch (error) {
    next(error);
  }
};

export const getReelComments = async (req, res, next) => {
  const { reelId } = req.params;
  try {
    const comments = await UserPhotoServices.getReelComments(reelId);
    res.status(HTTP.StatusCodes.OK).json({ comments });
  } catch (error) {
    next(error);
  }
};

export const uploadToInstagram = async (req, res, next) => {
  try {
    const { mediaUrl } = req.body
    const user = await getUser(req.user.id)
    const caption = `Take a look at this awesome moment from ${user.fullName}'s adventures!`
    const result = await UserPhotoServices.uploadToInstagram(mediaUrl, caption)
    res.sendStatus(200)
  } catch (error) {
    next(error);
  }
}