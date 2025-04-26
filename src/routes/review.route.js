import express from 'express';
import * as ReviewControllers from '../controllers/review.controller.js';

const router = express.Router();

router.post('/', ReviewControllers.createReview);
router.get('/:reviewId', ReviewControllers.getReviewById);
router.get('/user/:userId', ReviewControllers.getReviewsForUser);
router.put('/:reviewId', ReviewControllers.updateReview);
router.delete('/:reviewId', ReviewControllers.deleteReview);

export default router;
