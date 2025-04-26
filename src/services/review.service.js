import Review from '../models/review.model.js';

export const createReview = async (reviewData) => {
  const { reviewerId, revieweeId, tripId, rating, comment } = reviewData;
  try {
    return await Review.create({
      reviewerId,
      revieweeId,
      tripId,
      rating,
      comment,
    });
  } catch (error) {
    throw error;
  }
};

export const getReviewById = async (reviewId) => {
  try {
    return await Review.findById(reviewId)
      .populate('reviewerId', 'fullName email')
      .populate('revieweeId', 'fullName email')
      .exec();
  } catch (error) {
    throw error;
  }
};

export const getReviewsForUser = async (userId) => {
  try {
    return await Review.find({ revieweeId: userId })
      .populate('reviewerId', 'fullName email')
      .exec();
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (reviewId, updatedData) => {
  try {
    const review = await Review.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }
    Object.assign(review, updatedData);
    await review.save();
    return review;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    return await Review.findByIdAndDelete(reviewId);
  } catch (error) {
    throw error;
  }
};