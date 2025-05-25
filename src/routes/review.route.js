import express from 'express';
import * as ReviewControllers from '../controllers/review.controller.js';
import { verifyToken } from '../middlewares/auth.js';
const router = express.Router();

router.post('/createReview',verifyToken, ReviewControllers.createReview);
router.get('/:reviewId', ReviewControllers.getReviewById);
router.get('/userReviews/:userId', ReviewControllers.getReviewsForUser);
router.put('/:reviewId', ReviewControllers.updateReview);
router.delete('/:reviewId', ReviewControllers.deleteReview);

export default router;
