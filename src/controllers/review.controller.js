import * as ReviewService from '../services/review.service.js';
import HTTP from '../constants/status.js';

export const createReview = async (req, res, next) => {
  try {

    const review = await ReviewService.createReview(req.body)
    return res.status(HTTP.StatusCodes.CREATED).json(review);
  } catch (error) {
    next(error);
  } 
};

export const getReviewById = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await ReviewService.getReviewById(reviewId);
    res.status(HTTP.StatusCodes.OK).json(review);
  } catch (error) {
    next(error);
  }
};

export const getReviewsForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const reviews = await ReviewService.getReviewsForUser(userId);
    res.status(HTTP.StatusCodes.OK).json(reviews);
  } catch (error) {
    next(error)
  }
};

export const updateReview = async (req, res, next) => {
    try {
      const { reviewId } = req.params;
      const reviewData = req.body;
      const updated = await ReviewService.updateReview(reviewId, reviewData);
      res.status(HTTP.StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
};

export const deleteReview = async (req, res, next) => {    
    try {
      await ReviewService.deleteReview(req.body.reviewId);
      res.status(HTTP.StatusCodes.NO_CONTENT).send()
    } catch (error) {
      next(error);
    }
  };
  

