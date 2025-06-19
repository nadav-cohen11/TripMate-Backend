import mongoose from 'mongoose';
import {
  GeoLocationSchema,
  TravelDatesSchema,
  ItineraryItemSchema,
  ParticipantSchema,
} from './sharedSchemas.model.js';

const { Schema } = mongoose;

const TripSchema = new Schema({
  host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  destination: {
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    location: GeoLocationSchema,
  },
  travelDates: TravelDatesSchema,
  groupSize: { type: Number, min: 1 },
  description: { type: String, trim: true },
  itinerary: [ItineraryItemSchema],
  participants: [ParticipantSchema],
  tags: [{ type: String, lowercase: true, trim: true }],
  ai: { type: String },
  aiGenerated: { type: Boolean, default: false },

}, {
  timestamps: true,
  
});

TripSchema.index({ 'destination.city': 1, 'travelDates.start': 1 });
TripSchema.index({ 'destination.location': '2dsphere' });

export default mongoose.model('Trip', TripSchema);
