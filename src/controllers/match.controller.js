import * as MatchServices from '../services/match.service.js';
import HTTP from '../constants/status.js';

export const createOrAcceptMatch = async (req, res, next) => {
  try {
    const user1Id = req.user.id;
    const { user2Id } = req.body;
    const { score } =  await MatchServices.calculateCompatibilityScoresForMatch(user1Id, user2Id)
    const match = await MatchServices.createOrAcceptMatch(user1Id, user2Id, score);
    res.status(HTTP.StatusCodes.CREATED).json(match.status);
  } catch (error) {
    next(error);
  }
};


export const acceptMatch = async (req, res, next) => {
  try {
    const { matchId } = req.body;
    const match = await MatchServices.acceptMatch(matchId);
    res.status(HTTP.StatusCodes.CREATED).json(match.status);
  } catch (error) {
    next(error);
  }
};

export const getConfirmedMatches = async (req, res, next) => {
  try {
    const confirmeMatches = await MatchServices.getConfirmedMatches(req.user.id);
    res.status(HTTP.StatusCodes.OK).json({matches:confirmeMatches,userId:req.user.id});
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
    const matches = await MatchServices.getPendingReceived(req.user.id);
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
    const { matchId } = req.body
    const result = await MatchServices.declineMatch(matchId, req.user.id);
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
    const { matchId } = req.body
    const result = await MatchServices.blockMatch(matchId);
    res.status(HTTP.StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const getNonMatchedNearbyUsersWithReviews = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const maxDistance = parseInt(req.query.maxDistance, 10) || 10000;

    const users = await MatchServices.getNonMatchedNearbyUsersWithReviews(userId, maxDistance);

    const usersWithScores = await Promise.all(
      users.map(async (u) => {
        const { score } = await MatchServices.calculateCompatibilityScoresForMatch(u._id, userId);
        return { ...u, compatibilityScore: score };
      })
    );
    res.status(HTTP.StatusCodes.OK).json(usersWithScores);
  } catch (error) {
    next(error);
  }
};
