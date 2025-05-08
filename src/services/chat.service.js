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
    return await message.populate('sender', '_id fullName');
  } catch (error) {
    throw error;
  }
};

export const findOrCreateChat = async (userA, userB) => {
  let chat = await Chat.findOne({
    participants: { $all: [userA, userB], $size: 2 },
    isGroupChat: false,
    isArchived:false
  });
  if (!chat) {
    chat = await Chat.create({ participants: [userA, userB] });
  }
  return chat;
};

export const createGroupChat = async (participants, chatName, tripId) => {
  const chat = await Chat.create({ isGroupChat: true, participants, chatName, tripId });
  return chat;
};


export const getChat = async (chatId) => {
  return Chat.findById(chatId)
    .populate('participants', 'fullName _id')
    .populate({
      path: 'messages',
      populate: { path: 'sender', select: 'fullName _id' }
    });
}

export const getChatsByUser = async (userId) => {
  return Chat.find({ participants: userId, isArchived: false })
    .populate('participants', 'fullName _id')
    .populate({
      path: 'messages',
      populate: { path: 'sender', select: 'fullName _id' }
    });
};

export const archiveChat = async (chatId) => {
  return Chat.findByIdAndUpdate(chatId, { isArchived: true }, { new: true });
}

export const updateLastMessage = async (chatId, msg) => {
  return Chat.findByIdAndUpdate(
    chatId,
    { $set: { lastMessagePreview: msg } },
    { new: true }
  );
}
export const deleteUserFromGroup = async (chatId, userId) => {
  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroupChat) {
      throw new Error('Group chat not found');
    }
    chat.participants = chat.participants.filter(
      participant => participant.toString() !== userId.toString()
    );
    await chat.save();
    return chat;
  } catch (error) {
    throw error;
  }
};
