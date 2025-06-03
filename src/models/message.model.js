import mongoose from 'mongoose';

const { Schema, Types } = mongoose;

export const MessageSchema = new Schema({
  sender: {
    type: Types.ObjectId,
    ref: 'User',
    required: false,
    index: true,
  },
  chatId: {
    type: Types.ObjectId,
    ref: 'Chat',
    required: true,
    index: true,
  },
  content: {
    type: String,
    trim: true,
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'video', 'file', 'location'],
    default: 'text',
  },
  mediaUrl: {
    type: String,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  readBy: [{
    type: Types.ObjectId,
    ref: 'User',
  }],
});

 export default mongoose.model('Message', MessageSchema);