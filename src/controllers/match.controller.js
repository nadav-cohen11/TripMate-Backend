import * as MatchServices from '../services/match.service.js';
import HTTP from '../constants/status.js';

export const createOrAcceptMatch = async (req, res, next) => {
  try {
    const user1Id = req.user.id;
    const { user2Id, scores } = req.body;
    const match = await MatchServices.createOrAcceptMatch(user1Id, user2Id, scores);
    res.status(HTTP.StatusCodes.CREATED).json(match.status);
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

export const getAllMatches = async (req, res, next) => {
  try {
    const matches = await MatchServices.getAllMatches();
    res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    next(error);
  }
};

export const getReceivedPending = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const matches = await MatchServices.getPendingReceived(userId);
    res.status(HTTP.StatusCodes.OK).json(matches);
  } catch (error) {
    next(error);
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
    const { matchId } = req.params
    const result = await MatchServices.declineMatch(matchId, req.body.userId);
    res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const unmatch = async (req, res, next) => {
  try {
    const user1Id = req.user.id;
    const { user2Id } = req.body;
    await MatchServices.unmatchUsers(user1Id, user2Id);
    res.status(HTTP.StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const block = async (req, res, next) => {
  try {
    const { matchId } = req.params
    const result = await MatchServices.blockMatch(matchId, req.body.userId);
    res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};


export const getNonMatchedUsers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const nonMatchedUsers = await MatchServices.getNonMatchedUsers(userId);
    res.status(HTTP.StatusCodes.OK).json(nonMatchedUsers);
  } catch (error) {
    next(error);
  }
};
