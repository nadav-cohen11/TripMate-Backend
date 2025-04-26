import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

const MatchSchema = new Schema({
  user1Id: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  user2Id: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tripId: {
    type: Types.ObjectId,
    ref: 'Trip',
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined'],
    default: 'pending',
  },
  initiatedBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
  matchedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
  },
  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  locationProximityScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  sharedInterestsScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Matches', MatchSchema);
