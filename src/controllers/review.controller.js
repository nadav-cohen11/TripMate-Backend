import * as ReviewService from '../services/review.service.js';
import HTTP from '../constants/status.js';
import sendErrorResponse from '../utils/errorHandler.js';

export const createReview = async (req, res) => {
  const { reviewerId, revieweeId, tripId, rating, comment } = req.body;
  try {
    const review = await ReviewService.createReview({
      reviewerId,
      revieweeId,
      tripId,
      rating,
      comment,
    });
    return res.status(HTTP.StatusCodes.CREATED).json(review);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, error.message);
  }
};

export const getReviewById = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await ReviewService.getReviewById(reviewId);
    return res.status(HTTP.StatusCodes.OK).json(review);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, error.message);
  }
};

export const getReviewsForUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await ReviewService.getReviewsForUser(userId);
    return res.status(HTTP.StatusCodes.OK).json(reviews);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, error.message);
  }
};

export const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    try {
      const updatedReview = await ReviewService.updateReview(reviewId, { rating, comment });
      return res.status(HTTP.StatusCodes.OK).json(updatedReview);
    } catch (error) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, error.message);
    }
};

export const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    try {
      const result = await ReviewService.deleteReview(reviewId);
      if (!result) {
        return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Review not found');
      }
      return res.status(HTTP.StatusCodes.OK).json({ message: 'Review successfully deleted' });
    } catch (error) {
      return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, error.message);
    }
  };
  

