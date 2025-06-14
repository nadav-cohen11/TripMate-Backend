import createError from 'http-errors';
import HTTP from '../constants/status.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import axios from 'axios';

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
  await user.save();
  return photo;
};

export const uploadUserReel = async (userId, file, tripId, firstComment) => {
  if (!file) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'No file uploaded');
  }

  if (!tripId) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'No trip provided');
  }

  if (!mongoose.Types.ObjectId.isValid(tripId)) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid tripId');
  }

  const tripObjectId = new mongoose.Types.ObjectId(tripId);

  const user = await getUserOrThrow(userId);
  const reel = formatUploadedFile(file);

  if (!reel.url || !reel.public_id || !reel.type) {
    throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid reel format');
  }

  reel.tripId = tripObjectId;


  user.reels ??= [];
  user.reels.push(reel);

  if (firstComment) {
    reel.comments = [{
      userId: new mongoose.Types.ObjectId(userId),
      text: firstComment.trim(),
    }];
  } else {
    reel.comments = [];
  }
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

export const getAllReels = async (cuurUserId) => {
  try {
    const users = await User.find({
      'reels.0': { $exists: true },
      _id: { $ne: cuurUserId },
    }).populate('reels.comments.userId', 'fullName');

    const reels = users.flatMap(user => {
      const profilePhoto = user.photos.find(photo =>
        photo.public_id.includes(user.profilePhotoId)
      );

      return user.reels.map(reel => ({
        _id: reel._id,
        url: reel.url,
        public_id: reel.public_id,
        type: reel.type,
        tripId: reel.tripId,
        createdAt: reel.createdAt,
        userFullName: user.fullName,
        userId: user._id.toString(),
        userProfilePhotoUrl: profilePhoto?.url || null,
        likesCount: reel.likes.length,
        comments: reel.comments.map(comment => ({
          _id: comment._id,
          text: comment.text,
          createdAt: comment.createdAt,
          userId: comment.userId?._id || comment.userId,
          userFullName: comment.userId?.fullName || null,
        }))
      }));
    });

    return reels;
  } catch (error) {
    throw createError(HTTP.StatusCodes.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const addComment = async (userId, reelId, text) => {
  const user = await User.findOne({ 'reels._id': reelId });

  if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found');

  const reel = user.reels.id(reelId);
  if (!reel) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found inside user');

  const comment = {
    userId: new mongoose.Types.ObjectId(userId),
    text,
  };

  reel.comments.push(comment);

  await user.save();

  const userInfo = await User.findById(userId).select('fullName');

  return {
    comment: {
      userId: {
        _id: userInfo._id,
        fullName: userInfo.fullName,
      },
      text: comment.text,
    }
  };  
};  

export const addLike = async (userId, reelId) => {
  const user = await User.findOne({ 'reels._id': reelId })
  .populate('reels.likes.userId', 'fullName');

  if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found');

  const reel = user.reels.id(reelId);
  if (!reel) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found inside user');

  const alreadyLiked = reel.likes.some((like) => like.userId.toString() === userId);
  if (alreadyLiked) throw createError(HTTP.StatusCodes.NOT_FOUND, 'User already liked this reel');

  reel.likes.push({ userId: new mongoose.Types.ObjectId(userId) });

  await user.save();

  return reel.likes.map((like) => ({
    userId: like.userId.toString(),
    fullName: like.userId.fullName,
  }));
};

export const removeLike = async (userId, reelId) => {
  const user = await User.findOne({ 'reels._id': reelId })
  .populate('fullName');

  if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found');

  const reel = user.reels.id(reelId);
  if (!reel) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found inside user');

  reel.likes = reel.likes.filter(
    (like) => like.userId.toString() !== userId
  );

  await user.save();
  return user;
};


export const getReelLikesCount = async (reelId) => {
  const user = await User.findOne({ 'reels._id': reelId })

  if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found');

  const reel = user.reels.id(reelId);
  if (!reel) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found inside user');

  return reel.likes.length;
};

export const getReelComments = async (reelId) => {
  const user = await User.findOne({ 'reels._id': reelId })
  .populate('reels.comments.userId', 'fullName');

  if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found');

  const reel = user.reels.id(reelId);
  if (!reel) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reel not found inside user');

  return reel.comments;
};

export const uploadToInstagram = async(mediaUrl,caption) => {
  try {
    const baseUrl = 'https://graph.facebook.com/v19.0'

    const mediaBody = {
      "image_url": mediaUrl,
      "caption": caption,
      "access_token": process.env.API_KEY_INSTAGRAM
    } 
    const resMedia = await axios.post(
      `${baseUrl}/${process.env.INSTAGRAM_PAGE_ID}/media`,
      mediaBody,
    );

    if(!resMedia || !resMedia.data || !resMedia.data.id) {
      throw createError(HTTP.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create Instagram media');
    }

    const publishBody = {
      creation_id: resMedia.data.id,
      access_token: process.env.API_KEY_INSTAGRAM
    };
    const resPublish = await axios.post(
      `${baseUrl}/${process.env.INSTAGRAM_PAGE_ID}/media_publish`,
      publishBody
    );

    if(!resPublish || !resPublish.data || !resPublish.data.id) {
      throw createError(HTTP.StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to publish Instagram media');
    }

    return resPublish.data;
  } catch (error) {
    console.error('Instagram upload error:', error.response?.data || error.message || error);
    throw error
  }
}

