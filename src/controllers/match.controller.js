import * as MatchServices from '../services/match.service.js';
import HTTP from '../constants/status.js';
import sendErrorResponse from '../utils/errorHandler.js';

export const createOrAcceptMatch = async (req, res, next) => {
  try {
    const { user1Id, user2Id, tripId, scores } = req.body;
    const match = await MatchServices.createOrAcceptMatch(user1Id, user2Id, tripId, scores);
    res.status(HTTP.StatusCodes.CREATED).json(match);
  } catch (error) {
    next(error);
  }
};

export const getConfirmedMatches = async (req, res, next) => {
  try {
    const confirmeMatches = await MatchServices.getConfirmedMatches(req.user.id);
    res.status(HTTP.StatusCodes.OK).json(confirmeMatches);
  } catch (error) {
    next(error);
  }
};

export const getAllMatches = async (req, res) => {
  try {
    const matches = await MatchServices.getAllMatches();
    res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to fetch all matches');
  }
};

export const getReceivedPending = async (req, res) => {
  const { userId } = req.params;
  try {
    const matches = await MatchServices.getPendingReceived(userId);
    res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    return sendErrorResponse(res, HTTP.StatusCodes.BAD_REQUEST, 'Failed to fetch received pending matches');
  }
};

export const getSentPending = async (req, res, next) => {
  try {
    const matches = await MatchServices.getPendingSent(req.user.id);
    res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    next(error);
  }
};

export const decline = async (req, res, next) => {
  try {
    const {matchId} = req.params
    const result = await MatchServices.declineMatch(matchId, req.body.userId);
    res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const unmatch = async (req, res, next) => {
  try {
    const { user1Id, user2Id, tripId } = req.body;
    await MatchServices.unmatchUsers(user1Id, user2Id, tripId);
    res.status(HTTP.StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const block = async (req, res, next) => {
  try {
    const {matchId} = req.params
    const result = await MatchServices.blockMatch(matchId, req.body.userId);
    res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
