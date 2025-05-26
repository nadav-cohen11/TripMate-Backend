import createError from 'http-errors';
import HTTP from '../constants/status.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';

const formatUploadedFile = (file) => {
  if (!file?.path || !file?.filename || !file?.mimetype) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid file structure');
  }

  return {
    url: file.path,
    public_id: file.filename,
    type: file.mimetype.startsWith('video') ? 'video' : 'image',
  };
};

const getUserOrThrow = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
  }
  return user;
};

export const uploadUserPhotos = async (userId, files = []) => {
  if (!files.length) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'No files uploaded');
  }

  const formattedPhotos = files.map(formatUploadedFile);

  const user = await User.findByIdAndUpdate(
    userId,
    { $push: { photos: { $each: formattedPhotos } } },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
  }

  return user.photos.filter((p) => typeof p.url === 'string');
};

export const uploadProfilePhoto = async (userId, file) => {
  if (!file) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'No file uploaded');
  }

  const user = await getUserOrThrow(userId);
  const photo = formatUploadedFile(file);

  user.photos ??= [];
  user.photos.push(photo);
  user.profilePhotoId = photo.public_id;
  console.log(user)
  await user.save();
  return photo;
};

export const uploadUserReel = async (userId, file) => {
  if (!file) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'No file uploaded');
  }

  const user = await getUserOrThrow(userId);
  const reel = formatUploadedFile(file);

  if (!reel.url || !reel.public_id || !reel.type) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid reel format');
  }

  user.reels ??= [];
  user.reels.push(reel);

  await user.save();
  return user.reels;
};

const deleteMediaFromCloudinary = async (publicId, type) => {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: type === 'video' ? 'video' : 'image',
  });
};

export const deleteGalleryPhoto = async (userId, publicId) => {
  if (!publicId) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Missing publicId');
  }

  const user = await getUserOrThrow(userId);
  const photo = user.photos.find((p) => p.public_id === publicId);

  if (!photo) {
    throw createError(HTTP.StatusCodes.NOT_FOUND, 'Photo not found');
  }

  await deleteMediaFromCloudinary(publicId, photo.type);
  user.photos = user.photos.filter((p) => p.public_id !== publicId);

  await user.save();
  return user.photos;
};

export const deleteGalleryReel = async (userId, publicId) => {
  if (!publicId) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Missing publicId');
  }

  const user = await getUserOrThrow(userId);
  const reel = user.reels.find((r) => r.public_id === publicId);

  if (!reel) {
    throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found');
  }

  await deleteMediaFromCloudinary(publicId, reel.type);
  user.reels = user.reels.filter((r) => r.public_id !== publicId);

  await user.save();
  return user.reels;
};

export const setProfilePhoto = async (userId, publicId) => {
  const user = await getUserOrThrow(userId);
  const exists = user.photos.some((p) => p.public_id === publicId);

  if (!exists) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid publicId');
  }

  user.profilePhotoId = publicId;
  await user.save();

  return user.profilePhotoId;
};

export const getAllReels = async () => {
  try {
    const users = await User.find({ 'reels': { $exists: true } });
    const reels = users.flatMap(user => user.reels);
    return reels;
  } catch (error) {
    throw createError(HTTP.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};
