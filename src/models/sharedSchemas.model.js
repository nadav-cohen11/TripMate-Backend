import mongoose from 'mongoose';

const { Schema } = mongoose;

export const TravelDatesSchema = new Schema({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
}, { _id: false });

export const AgeRangeSchema = new Schema({
  min: { type: Number, min: 0 },
  max: { type: Number, min: 0 },
}, { _id: false });

export const TravelPreferencesSchema = new Schema({
  destinations: [{ type: String, trim: true }],
  travelDates: TravelDatesSchema,
  groupSize: { type: Number, min: 1 },
  ageRange: AgeRangeSchema,
  interests: [{ type: String, trim: true, lowercase: true }],
  travelStyle: {
    type: String,
    enum: ['budget', 'luxury', 'adventure', 'cultural', 'nature', 'social'],
  },
}, { _id: false });

export const GeoLocationSchema = new Schema({
  type: { type: String, enum: ['Point'], default: 'Point' },
  coordinates: {
    type: [Number],
    required: true,
  },
  country: { type: String },
  city: { type: String },
}, { _id: false });

export const SocialLinksSchema = new Schema({
  instagram: String,
  facebook: String,
}, { _id: false });

export const ItineraryItemSchema = new Schema({
  day: { type: Number, required: true },
  activities: [{
    time: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: String,
    location: String,
  }],
}, { _id: false });

export const ParticipantSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  isConfirmed: { type: Boolean, default: true },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

export const mediaSchema = new  Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
}, { _id: false });

export const commentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

export const likeSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likedAt: { type: Date, default: Date.now }
}, { _id: true });

export const reelSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  type: { type: String, enum: ['image', 'video'], required: true },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: false },
  comments: { type: [commentSchema], default: [] },
  likes: { type: [likeSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });