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
