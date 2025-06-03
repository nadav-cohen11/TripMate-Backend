import express, { Router } from 'express';
import { verifyToken } from '../middlewares/auth.js';
import upload from '../middlewares/cloudinaryUpload.js';
import * as UserPhotoControllers from '../controllers/userPhoto.controller.js';

const router = express.Router();

router.post('/upload-photos', verifyToken, upload.array('photos', 10), UserPhotoControllers.handleUploadPhotos);
router.post('/upload-profile', verifyToken, upload.single('profile'), UserPhotoControllers.handleUploadProfilePhoto);
router.post('/upload-reel', verifyToken, upload.single('reel'), UserPhotoControllers.handleUploadReel);
router.delete('/delete-photo', verifyToken, UserPhotoControllers.handleDeletePhoto);
router.delete('/delete-reel', verifyToken, UserPhotoControllers.handleDeleteReel);
router.get('/getAllReels', verifyToken, UserPhotoControllers.getAllReels)
router.post('/comment', verifyToken, UserPhotoControllers.addComment);
router.post('/like', verifyToken, UserPhotoControllers.addLike);
router.post('/unlike', verifyToken, UserPhotoControllers.removeLike);

router.get('/:reelId/likes', verifyToken, UserPhotoControllers.getReelLikesCount);
router.get('/:reelId/comments', verifyToken, UserPhotoControllers.getReelComments);


export default router;
