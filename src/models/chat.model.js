import mongoose from 'mongoose';
import { MessageSchema } from './messege.model.js';

const { Schema,Types } = mongoose;

const ChatSchema = new Schema({
  isGroupChat: {
    type: Boolean,
    default: false,
  },
  chatName: {
    type: String,
    trim: true,
  },
  participants: [{
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [MessageSchema],
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
  lastMessagePreview: {
    type: String,
    default: '',
  },
  groupAdmin: {
    type: Types.ObjectId,
    ref: 'User',
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastMessageAt: -1 });

export default mongoose.model('Chat', ChatSchema);
