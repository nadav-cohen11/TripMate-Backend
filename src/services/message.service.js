import Message from '../models/message.model.js'
import mongoose from 'mongoose';

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createMessage = async (messageData) => {
  if (!messageData || !messageData.sender || !messageData.content) {
    throw new Error('Missing required message fields');
  }
  try {
    const message = new Message(messageData);
    await message.save();
    return message;
  } catch (error) {
    throw error;
  }
}

export const deleteMessage = async (messageId) => {
  if (!isValidObjectId(messageId)) {
    throw new Error('Invalid message ID');
  }
  try {
    return await Message.findByIdAndDelete(messageId);
  } catch (error) {
    throw error;
  }
}

export const updateMessage = async (messageId, content) => {
  if (!isValidObjectId(messageId)) {
    throw new Error('Invalid message ID');
  }
  if (!content || typeof content !== 'string') {
    throw new Error('Invalid content');
  }
  try {
    return await Message.findByIdAndUpdate(messageId, { content }, { new: true });
  } catch (error) {
    throw error;
  }
}

export const getMessage = async (messageId) => {
  if (!isValidObjectId(messageId)) {
    throw new Error('Invalid message ID');
  }
  try {
    return await Message.findById(messageId);
  } catch (error) {
    throw error;
  }
}

export const getMessagesByUser = async (userId) => {
  if (!isValidObjectId(userId)) {
    throw new Error('Invalid user ID');
  }
  try {
    return await Message.find({ sender: userId });
  } catch (error) {
    throw error;
  }
}
