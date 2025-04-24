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

// MatchSchema.index(
//   { user1Id: 1, user2Id: 1 },
//   { unique: true }
// );

export default mongoose.model('Match', MatchSchema);
