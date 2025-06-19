import Chat from '../models/chat.model.js';
import Message from '../models/message.model.js';
import * as TripServices from './trip.service.js';

export const createMessage = async (room, sender, msg) => {
  try {

    if (!room) throw new Error('Room (chatId) is required');
    if (!msg || !msg.content) throw new Error('Message content is required');

    const chat = await Chat.findById(room);
    if (!chat) throw new Error('Chat not found');

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
  try {
    if (!userA || !userB) throw new Error('Both userA and userB are required');
    if (userA.toString() === userB.toString()) throw new Error('Cannot create chat with self');

    let chat = await Chat.findOne({
      participants: { $all: [userA, userB], $size: 2 },
      isGroupChat: false,
      isArchived: false
    });
    if (!chat) {
      chat = await Chat.create({ participants: [userA, userB] });
      chat = await chat.populate('participants', 'fullName _id');
    }
    return chat;
  } catch (error) {
    throw error;
  }
};

export const createGroupChat = async (participants, chatName, tripId) => {
  try {
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
      throw new Error('Participants are required to create a group chat');
    }
    if (participants.length < 2) {
      throw new Error('At least two participants are required to create a group chat');
    }
    if (!chatName || typeof chatName !== 'string' || chatName.trim() === '') {
      throw new Error('Chat name is required');
    }
    if (!tripId) {
      throw new Error('Trip ID is required');
    }
    const existingTrip = await TripServices.getTrip(tripId);
    if (!existingTrip) {
      throw new Error('Trip not found');
    }
    let chat = await Chat.create({ isGroupChat: true, participants, chatName, tripId });
    chat = await chat.populate('participants', 'fullName _id');
    return chat;
  } catch (error) {
    throw error;
  }
};

export const getChat = async (chatId) => {
  try {
    if (!chatId) {
      throw new Error('Chat ID is required');
    }
    const chat = await Chat.findById(chatId)
      .populate('participants', 'fullName _id')
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: 'fullName _id' }
      });
    if (!chat) throw new Error('Chat not found');
    return chat;
  } catch (error) {
    throw error;
  }
};

export const getChatsByUser = async (userId) => {
  try {
    if (!userId) throw new Error('User ID is required');
    return await Chat.find({ participants: userId, isArchived: false })
      .populate('participants', 'fullName _id')
      .populate({
        path: 'messages',
        populate: { path: 'sender', select: 'fullName _id' }
      });
  } catch (error) {
    throw error;
  }
};

export const archiveChat = async (chatId) => {
  try {
    if (!chatId) throw new Error('Chat ID is required');
    const chat = await Chat.findByIdAndUpdate(chatId, { isArchived: true }, { new: true });
    if (!chat) throw new Error('Chat not found');
    return chat;
  } catch (error) {
    throw error;
  }
};

export const updateLastMessage = async (chatId, msg) => {
  try {
    if (!chatId) throw new Error('Chat ID is required');
    if (!msg) throw new Error('Message is required');
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $set: { lastMessagePreview: msg } },
      { new: true }
    );
    if (!chat) throw new Error('Chat not found');
    return chat;
  } catch (error) {
    throw error;
  }
};

export const deleteUserFromGroup = async (chatId, userId) => {
  try {
    if (!chatId) throw new Error('Chat ID is required');
    if (!userId) throw new Error('User ID is required');
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroupChat) {
      throw new Error('Group chat not found');
    }
    if (!chat.participants.some(participant => participant.toString() === userId.toString())) {
      throw new Error('User is not a participant in this group');
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

export const getGroupChatsByUser = async (userId) => {
  try {
    const groupChats = await Chat.find({ 
      isGroupChat: true, 
      participants: { $elemMatch: { $eq: userId } } 
    });
    return groupChats;
  } catch (error) {
    throw error;
  }
};

export const getAllGroupChats = async() => {
  try {
    const groupChats = await Chat.find({
      isGroupChat: true
    });
    return groupChats;
  } catch (error) {
    throw error;
  }
}