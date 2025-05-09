import Match from '../models/match.model.js';
import createError from 'http-errors';
import HTTP from '../constants/status.js';
import User from '../models/user.model.js';

export const createOrAcceptMatch = async (user1Id, user2Id, scores = {}) => {
  try {
    const existingPendingMatch = await Match.findOne({
      user1Id: user2Id,
      user2Id: user1Id,
      status: 'pending',
    });

    if (existingPendingMatch) {
      existingPendingMatch.status = 'accepted';
      existingPendingMatch.matchedAt = new Date();
      await existingPendingMatch.save();

      return await Match.create({
        user1Id,
        user2Id,
        initiatedBy: user1Id,
        status: 'accepted',
        respondedAt: new Date(),
        ...scores,
      });
    }

    const existing = await Match.findOne({ user1Id, user2Id });
    if (existing) throw createError(HTTP.StatusCodes.CONFLICT, 'match already exist');
    const match = await Match.create({
      user1Id,
      user2Id,
      initiatedBy: user1Id,
      status: 'pending',
      ...scores,
    });
    return match;
  } catch (error) {
    throw error;
  }
};

export const getAllMatches = async () => {
  try {
    const matches = await Match.find({})
      .populate({ path: 'user1Id', select: 'fullName photos' })
      .populate({ path: 'user2Id', select: 'fullName photos' })
      .populate({ path: 'tripId', select: 'tripName date' })
      .sort({ createdAt: -1 });
    if (!matches) throw createError(HTTP.StatusCodes.CONFLICT, 'No matches found');
    return matches;
  } catch (error) {
    throw error;
  }
};


export const getPendingReceived = async (userId) => {
  try {
    const pendingReceived = await Match.find({
      user2Id: userId,
      status: 'pending',
    })
      .populate({ path: 'user1Id', select: 'fullName photos' })
      .populate({ path: 'tripId', select: 'tripName date' })
      .sort({ createdAt: -1 });
    if (!pendingReceived) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Pending matches not found')
    return pendingReceived;
  } catch (error) {
    throw error;
  }
};

export const getConfirmedMatches = async (userId) => {
  try {
    const confirmedMatches = await Match.find({
      status: 'accepted',
      $or: [{ user1Id: userId }, { user2Id: userId }],
    })
      .populate({ path: 'user1Id', select: 'fullName photos bio gender adventureStyle ' })
      .populate({ path: 'user2Id', select: 'fullName photos bio gender adventureStyle ' })
      .populate({ path: 'tripId', select: 'tripName date' })
      .sort({ respondedAt: -1 });
    if (!confirmedMatches) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Confirmed matches not found');
    return confirmedMatches;
  } catch (error) {
    throw error;
  }
};

export const getPendingSent = async (userId) => {
  try {
    const PendingSentMatches = await Match.find({
      status: 'pending',
      $or: [{ user1Id: userId }, { user2Id: userId }],
    })
      .populate({ path: 'user2Id', select: 'fullName photos bio gender adventureStyle ' })
      .populate({ path: 'tripId', select: 'tripName date' })
      .sort({ createdAt: -1 });
    if (!PendingSentMatches) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Pending sent matches not found');
    return PendingSentMatches;
  } catch (error) {
    throw error;
  }
};

export const declineMatch = async (matchId, userId) => {
  try {
    const match = await Match.findById(matchId);
    if (!match) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Match not found');
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!match.user1Id.equals(userObjectId) && !match.user2Id.equals(userObjectId)) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Unauthorized to decline this match'); 
    match.status = 'declined';
    match.respondedAt = new Date();
    const savedMatch = await match.save();
    return savedMatch;
  } catch (error) {
    throw error;
  }
};

export const unmatchUsers = async (user1Id, user2Id) => {
  try {
    const unMatch = await Match.deleteMany({
      $or: [
        { user1Id: user1Id, user2Id: user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
    });
    return unMatch;
  } catch (error) {
    throw error;
  }
};

export const blockMatch = async (matchId, userId) => {
  try {
    const match = await Match.findById(matchId);
    if (!match) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Match not found');
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!match.user1Id.equals(userObjectId) && !match.user2Id.equals(userObjectId)) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Unauthorized to block this match');
    match.isBlocked = true;
    const BlockedMatch = await match.save();
    return BlockedMatch.isBlocked;
  } catch (error) {
    throw error;
  }
};

export const getNonMatchedUsers = async (userId) => {
  try {
    const matchedUserIds = await Match.find({
      $or: [{ user1Id: userId }, { user2Id: userId }],
    }).distinct('user1Id user2Id');

    const pendingSentUserIds = await Match.find({
      user1Id: userId,
      status: 'pending',
    }).distinct('user2Id');

    const excludedUserIds = matchedUserIds.concat(pendingSentUserIds, userId);

    const nonMatchedUsers = await User.find({
      _id: { $nin: excludedUserIds },
    }).select('-password -isDeleted -createdAt -updatedAt');
    if (nonMatchedUsers.length === 0) throw createError(HTTP.StatusCodes.NOT_FOUND, 'No users in your area');
    return nonMatchedUsers;
  } catch (error) {
    throw error;
  }
};