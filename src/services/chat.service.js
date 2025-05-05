import Chat from '../models/chat.model.js';
import Message from '../models/messege.model.js';

export const createMessage = async (room, sender, msg) => {
  try {
    const message = await Message.create({
      chatId: room,
      content: msg.content,
      sender: sender
    });

    await Chat.findByIdAndUpdate(
      room,
      { $push: { messages: message } },
      { new: true }
    );
    return message;
  } catch (error) {
    throw error;
  }
};

export const findOrCreateChat = async (userA, userB) => {
  let chat = await Chat.findOne({
    participants: { $all: [userA, userB], $size: 2 }
  });
  if (!chat) {
    chat = await Chat.create({ participants: [userA, userB] });
  }
  return chat;
};

export const getChatsByUser = async (userId) => {
  return Chat.find({ participants: userId })
    .populate('participants', 'fullName _id')
};


