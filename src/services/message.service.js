import Message from '../models/messege.model.js'

export const createMessage = async (messageData) => {
  try {
    const message = new Message(messageData);
    await message.save();
    return message;
  } catch (error) {
    throw error;
  }
}

export const deleteMessage = async (messageId) => {
  try {
    return await Message.findByIdAndDelete(messageId);
  } catch (error) {
    throw error;
  }
}

export const updateMessage = async (messageId, content) => {
  try {
    return await Message.findByIdAndUpdate(messageId, { content }, { new: true });
  } catch (error) {
    throw error;
  }
}

export const getMessage = async (messageId) => {
  try {
    return await Message.findById(messageId);
  } catch (error) {
    throw error;
  }
}


export const getMessagesByUser = async (userId) => {
  try {
    return await Message.find({ sender: userId });
  } catch (error) {
    throw error;
  }
}
