import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const ReviewSchema = new Schema({
  reviewerId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  revieweeId: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tripId: {
    type: Types.ObjectId,
    ref: 'Trip',
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 2000,
  },
}, {
  timestamps: true,
});

ReviewSchema.index({ reviewerId: 1, revieweeId: 1, tripId: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
