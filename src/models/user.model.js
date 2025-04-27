import mongoose from 'mongoose';
import {
  TravelPreferencesSchema,
  GeoLocationSchema,
  SocialLinksSchema,
} from './sharedSchemas.model.js';

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: { type: String, required: true },
  birthDate: { type: Date },
  gender: { type: String, enum: ['male', 'female'] },
  languagesSpoken: [{ type: String, lowercase: true, trim: true }],
  location: GeoLocationSchema,
  travelPreferences: TravelPreferencesSchema,
  adventureStyle: {
    type: String,
    enum: ['Relaxed', 'Exploratory', 'Extreme', 'Photography', 'Other'], // remove Other
    default: 'Exploratory',
  },
  bio: { type: String, maxlength: 100 },
  photos: [{ type: String }],
  socialLinks: SocialLinksSchema,
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true,
});

UserSchema.index({ location: '2dsphere' });

export default mongoose.model('User', UserSchema);
