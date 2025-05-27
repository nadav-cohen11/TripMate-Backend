import Match from '../models/match.model.js';
import createError from 'http-errors';
import HTTP from '../constants/status.js';
import User from '../models/user.model.js';
import logger from '../config/logger.js';
import mongoose from 'mongoose';

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

export const acceptMatch = async (matchId) => {
  try {
    const existingPendingMatch = await Match.findById(matchId);
    if (existingPendingMatch) {
      existingPendingMatch.status = 'accepted';
      existingPendingMatch.matchedAt = new Date();
      await existingPendingMatch.save();
      return existingPendingMatch;
    } else {
      throw createError(HTTP.StatusCodes.NOT_FOUND, 'Match not found');
    }
  } catch (error) {
    throw error;
  }
};

export const getAllMatches = async () => {
  try {
    const matches = await Match.find({})
      .populate({ path: 'user1Id', select: 'fullName photos' })
      .populate({ path: 'user2Id', select: 'fullName photos' })
      .populate({ path: 'tripId', select: 'tripName travelDates date' })
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
      isBlocked: false
    })
      .populate({ path: 'user1Id', select: 'fullName photos bio gender adventureStyle ' })
      .populate({ path: 'user2Id', select: 'fullName photos bio gender adventureStyle ' })

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
      isBlocked: false,
      status: 'accepted',
      $or: [{ user1Id: userId }, { user2Id: userId }],
    })
      .populate({ path: 'user1Id', select: 'fullName bio gender adventureStyle photos' })
      .populate({ path: 'user2Id', select: 'fullName photos bio gender adventureStyle ' })
      .sort({ respondedAt: -1 }).limit(0);

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
    if (!match.user1Id.equals(userId) && !match.user2Id.equals(userId)) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Unauthorized to decline this match');
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

export const blockMatch = async (matchId) => {
  try {
    const match = await Match.findById(matchId);
    if (!match) {
      throw createError(HTTP.StatusCodes.NOT_FOUND, 'Match not found');
    }
    match.isBlocked = true;
    return await match.save();
  } catch (error) {
    throw error;
  }
};

export const getNonMatchedNearbyUsers = async (userId, maxDistanceInMeters) => {
  try {
    if (maxDistanceInMeters < 0) {
      throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid maxDistanceInMeters value');
    }

    const matchedUserIds = await Match.find({
      $or: [{ user1Id: userId }, { user2Id: userId }],
    }).distinct('user1Id user2Id');

    const pendingSentUserIds = await Match.find({
      user1Id: userId,
      status: 'pending',
    }).distinct('user2Id');

    const excludedUserIds = [...new Set([...matchedUserIds, ...pendingSentUserIds, userId])];

    const currentUserLocation = await User.findById(userId);

    if (!currentUserLocation) throw createError(HTTP.StatusCodes.NOT_FOUND, 'User location not found');

    const nearbyUserLocations = await User.find({
      _id: { $nin: excludedUserIds },
      location: {
        $near: {
          $geometry: currentUserLocation.location,
          $maxDistance: maxDistanceInMeters,
        },
      },
    });

    const nearbyUserIds = nearbyUserLocations.map((loc) => loc._id.toString());

    const nonMatchedNearbyUsers = await User.find({
      _id: { $in: nearbyUserIds },
    }).select('-password -isDeleted -createdAt -updatedAt');

    if (nonMatchedNearbyUsers.length === 0) {
      throw createError(HTTP.StatusCodes.NOT_FOUND, 'No nearby users found');
    }

    const filteredUsers = nonMatchedNearbyUsers.filter(
      (user) => user._id.toString() !== userId.toString()
    );
    return filteredUsers;
  } catch (error) {
    throw error;
  }
};