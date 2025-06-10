import * as ChatServices from '../services/chat.service.js';
import * as MessageServices from '../services/message.service.js';
import HTTP from '../constants/status.js';
import sendErrorResponse from '../utils/errorHandler.js';

export const sendMessage = async (req, res) => {
  const { chatId, senderId, receiverId, content } = req.body;
  try {
    if (!chatId || !senderId || !receiverId || !content) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
    }

    const msg = await ChatServices.createMessage(chatId, { sender: senderId, receiver: receiverId, content })

    return res.status(HTTP.StatusCodes.CREATED).json(msg);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in sending message',
      error
    );
  }
};

export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.query;
    if (!chatId) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'Chat ID is required' });
    }
    const messages = await MessageServices.getMessagesByChat(chatId);
    return res.status(HTTP.StatusCodes.OK).json(messages);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in getting chat messages',
      error
    );
  }
};

export const getUserChats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'User ID is required' });
    }
    const chats = await ChatServices.getChatsByUser(userId);
    return res.status(HTTP.StatusCodes.OK).json(chats);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in getting user chats',
      error
    );
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    if (!messageId) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'Message ID is required' });
    }
    const deleted = await MessageServices.deleteMessage(messageId);
    if (!deleted) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.NOT_FOUND,
        'Message not found for deletion'
      );
    }
    return res.status(HTTP.StatusCodes.OK).json({ message: 'Message deleted' });
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in deleting message',
      error
    );
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;
    if (!messageId || !content) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'Missing required fields' });
    }
    const message = await MessageServices.updateMessage(messageId, content);
    if (!message) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.NOT_FOUND,
        'Message not found for update'
      );
    }
    return res.status(HTTP.StatusCodes.OK).json(message);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in updating message',
      error
    );
  }
};



