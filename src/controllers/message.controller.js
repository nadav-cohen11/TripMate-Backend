import * as MessageServices from '../services/message.service.js';
import HTTP from '../constants/status.js';
import sendErrorResponse from '../utils/errorHandler.js';

export const getMessage = async (req, res) => {
  try {
    const { messageId } = req.query;
    if (!messageId) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'Message ID is required' });
    }
    const message = await MessageServices.getMessage(messageId);
    if (!message) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.NOT_FOUND,
        'Message not found'
      );
    }
    return res.status(HTTP.StatusCodes.OK).json(message);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in getting message',
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
      return res.status(HTTP.StatusCodes.BAD_REQUEST);
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

export const getMessagesByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(HTTP.StatusCodes.BAD_REQUEST).json({ error: 'User ID is required' });
    }
    const messages = await MessageServices.getMessagesByUser(userId);
    return res.status(HTTP.StatusCodes.OK).json(messages);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in getting messages by user',
      error
    );
  }
};
