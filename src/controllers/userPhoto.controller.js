import HTTP from '../constants/status.js';
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
    const reels = await UserPhotoServices.uploadUserReel(req.user.id, req.file);
    res.status(HTTP.StatusCodes.OK).json({ reels });
  } catch (err) {
    next(err);
  }
};

export const handleDeletePhoto = async (req, res, next) => {
  try {
    const publicId = decodeURIComponent(req.query.publicId);
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
    const reels = await UserPhotoServices.getAllReels();
    res.status(HTTP.StatusCodes.OK).json({ reels });
  } catch (err) {
    next(err);
  }
};
