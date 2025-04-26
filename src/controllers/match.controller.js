import * as MatchServices from '../services/match.service.js';
import HTTP from '../constants/status.js';
import sendErrorResponse from '../utils/errorHandler.js';

export const createOrAcceptMatch = async (req, res) => {
  const { user1Id, user2Id, tripId, scores } = req.body;
  try {
    const match = await MatchServices.createOrAcceptMatch(user1Id, user2Id, tripId, scores);
    return res.status(HTTP.StatusCodes.CREATED).json(match);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, error.message);
  }
};

export const getConfirmedMatches = async (req, res) => {
  const { userId } = req.params;
  try {
    const matches = await MatchServices.getConfirmedMatches(userId);
    return res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to fetch confirmed matches');
  }
};

export const getAllMatches = async (req, res) => {
  try {
    const matches = await MatchServices.getAllMatches();
    return res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to fetch all matches');
  }
};

export const getReceivedPending = async (req, res) => {
  const { userId } = req.params;
  try {
    const matches = await MatchServices.getPendingReceived(userId);
    return res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to fetch received pending matches');
  }
};

export const getSentPending = async (req, res) => {
  const { userId } = req.params;
  try {
    const matches = await MatchServices.getPendingSent(userId);
    return res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to fetch sent pending matches');
  }
};

export const decline = async (req, res) => {
  const { matchId } = req.params;
  const { userId } = req.body;
  try {
    const result = await MatchServices.declineMatch(matchId, userId);
    return res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.FORBIDDEN, error.message);
  }
};

export const unmatch = async (req, res) => {
  const { user1Id, user2Id, tripId } = req.body;
  try {
    await MatchServices.unmatchUsers(user1Id, user2Id, tripId);
    return res.sendStatus(HTTP.StatusCodes.NO_CONTENT);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to unmatch');
  }
};

export const block = async (req, res) => {
  const { matchId } = req.params;
  const { userId } = req.body;
  try {
    const result = await MatchServices.blockMatch(matchId, userId);
    return res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.FORBIDDEN, error.message);
  }
};
