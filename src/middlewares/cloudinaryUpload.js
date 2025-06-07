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
      allowed_formats: ['jpg', 'jpeg', 'png'],
      },
      photos: {
      folder: 'user-gallery',
      transformation: [{ width: 1024, height: 1024, crop: 'limit' }],
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png'],
      },
      reel: {
      folder: 'user-reels',
      transformation: [],
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi'],
      },
    };
  
    if (!fieldToConfig[file.fieldname]) {
      throw createError(HTTP.StatusCodes.BAD_REQUEST, `Unsupported fieldname: ${file.fieldname}`);
    }
  
    const config = fieldToConfig[file.fieldname];
    
    return {
      ...config,
      tags: [file.fieldname, req.user?.id],
    };
  }  
});

const fileFilter = (req, file, cb) => {
  const isImage = ['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype);
  const isVideo = ['video/mp4', 'video/quicktime', 'video/x-msvideo'].includes(file.mimetype);

  if (file.fieldname === 'reel') {
    const size = parseInt(req.headers['content-length'] || '0');
    if (size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return cb(createError(HTTP.StatusCodes.BAD_REQUEST, 'Video exceeds 50MB size limit'));
    }
    return cb(null, true);
  }

  if ((file.fieldname === 'profile' || file.fieldname === 'photos') && isImage) return cb(null, true);

  cb(createError(HTTP.StatusCodes.BAD_REQUEST, `Unsupported file type: ${file.mimetype}`));
};

export default multer({ storage, fileFilter });
