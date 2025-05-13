import HTTP from '../constants/status.js';
import Review from '../models/review.model.js';
import createError from 'http-errors';

export const createReview = async (reviewData) => {
  try {
    const review = await Review.create(reviewData);
    return review;
  } catch (error) {
    throw error;
  }
};

export const getReviewById = async (reviewId) => {
  try {
    const review = await Review.findById(reviewId)
      .populate('reviewerId', 'fullName email')
      .populate('revieweeId', 'fullName email')
      .exec();
    if (!review) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Review not found')
    return review;
  } catch (error) {
    throw error;
  }
};

export const getReviewsForUser = async (userId) => {
  try {
    const userReviews = await Review.find({ revieweeId: userId })
      .populate('reviewerId', 'fullName email photos')
      .exec();
    if (!userReviews) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Reviews not found the user')
    return userReviews;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const review = await Review.findByIdAndUpdate(reviewId, reviewData, { new: true });
    if (!review) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Review not found');
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const deleted = await Review.findByIdAndDelete(reviewId);
    if (!deleted) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Review not found');
    return deleted;
  } catch (error) {
    throw error;
  }
};