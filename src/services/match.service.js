import Match from '../models/match.model.js';
import Trip from '../models/trip.model.js'

export const createOrAcceptMatch = async (user1Id, user2Id, tripId, scores = {}) => {
  try {
    const existingPendingMatch = await Match.findOne({
      user1Id: user2Id,
      user2Id: user1Id,
      tripId,
      status: 'pending',
    });

    if (existingPendingMatch) {
      existingPendingMatch.status = 'accepted';
      existingPendingMatch.respondedAt = new Date();
      await existingPendingMatch.save();

      return await Match.create({
        user1Id,
        user2Id,
        tripId,
        initiatedBy: user1Id,
        status: 'accepted',
        respondedAt: new Date(),
        ...scores,
      });
    }

    const existing = await Match.findOne({ user1Id, user2Id, tripId });
    if (existing) throw new Error('Match already exists');

    return await Match.create({
      user1Id,
      user2Id,
      tripId,
      initiatedBy: user1Id,
      status: 'pending',
      ...scores,
    });
  } catch (error) {
    throw error;
  }
};

export const getAllMatches = async () => {
  try {
    return await Match.find({})
      .populate('user1Id', 'fullName')
      .populate('user2Id', 'fullName')
      .populate('tripId', 'travelDates')
      .sort({ createdAt: -1 })
  } catch (error) {
    throw error;
  }
};

export const getPendingReceived = async (userId) => {
  try {
    return await Match.find({
      user2Id: userId,
      status: 'pending',
    })
      .populate('user1Id', 'name avatar')
      .populate('tripId', 'tripName date')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const getConfirmedMatches = async (userId) => {
  try {
    return await Match.find({
      isBlocked:false,
      status: 'accepted',
      $or: [{ user1Id: userId }, { user2Id: userId }],
    })
      .populate('user1Id', 'fullName')
      .populate('user2Id', 'fullName')
      .populate('tripId', 'travelDates')
      .sort({ matchedAt: -1 })
  } catch (error) {
    throw error;
  }
};

export const getPendingSent = async (userId) => {
  try {
    return await Match.find({
      status: 'pending',
      $or: [{ user1Id: userId }, { user2Id: userId }],
    })
      .populate('user2Id', 'name avatar')
      .populate('tripId', 'tripName date')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw error;
  }
};

export const declineMatch = async (matchId, userId) => {
  try {
    const match = await Match.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    if (!match.user2Id.equals(userId)) {
      throw new Error('Unauthorized to decline this match');
    }
    match.status = 'declined';
    match.respondedAt = new Date();
    return await match.save();
  } catch (error) {
    throw error;
  }
};

export const unmatchUsers = async (user1Id, user2Id, tripId) => {
  try {
    return await Match.deleteMany({
      tripId,
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
    });
  } catch (error) {
    throw error;
  }
};

export const blockMatch = async (user1Id, user2Id) => {
  try {
    const match = await Match.findOne({
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id },
      ],
    });
    if (!match) {
      throw new Error('Match not found');
    }
    match.isBlocked = true;
    return await match.save();
  } catch (error) {
    throw error;
  }
};
