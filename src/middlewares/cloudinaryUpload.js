import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import createError from 'http-errors';
import HTTP from '../constants/status.js';

const MAX_VIDEO_SIZE_MB = 50;

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const fieldToConfig = {
      profile: {
        folder: 'user-profile',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'heic'],
      },
      photos: {
        folder: 'user-gallery',
        transformation: [{ width: 1024, height: 1024, crop: 'limit' }],
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'heic'],
      },
      reel: {
        folder: 'user-reels',
        transformation: [],
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi', 'heic'],
      },
    };

    const config = fieldToConfig[file.fieldname];
    if (!config) {
      throw createError(HTTP.StatusCodes.BAD_REQUEST, `Unsupported fieldname: ${file.fieldname}`);
    }

    return {
      ...config,
      tags: [file.fieldname, req.user?.id || 'anonymous'],
    };
  },
});

const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/heic'];
const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];

const fileFilter = (req, file, cb) => {
  const { fieldname, mimetype } = file;
  const size = parseInt(req.headers['content-length'] || '0');

  if (fieldname === 'reel') {
    const isValidVideo = allowedVideoTypes.includes(mimetype);
    const isValidImage = allowedImageTypes.includes(mimetype);
    if (!(isValidVideo || isValidImage)) {
      return cb(createError(HTTP.StatusCodes.BAD_REQUEST, `Invalid file type for reel: ${mimetype}`));
    }
    if (isValidVideo && size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return cb(createError(HTTP.StatusCodes.BAD_REQUEST, 'Video exceeds 50MB size limit'));
    }
    return cb(null, true);
  }

  if ((fieldname === 'profile' || fieldname === 'photos') && allowedImageTypes.includes(mimetype)) {
    return cb(null, true);
  }

  return cb(createError(HTTP.StatusCodes.BAD_REQUEST, `Unsupported file type for ${fieldname}: ${mimetype}`));
};

export default multer({ storage, fileFilter });
