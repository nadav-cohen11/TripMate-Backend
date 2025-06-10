import Match from '../models/match.model.js';
import createError from 'http-errors';
import HTTP from '../constants/status.js';
import User from '../models/user.model.js';
import * as UserServices from '../services/user.service.js'
import mongoose from 'mongoose';

export const createOrAcceptMatch = async (user1Id, user2Id, compatibilityScore = 35) => {
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
        compatibilityScore,
      });
    }

    const existing = await Match.findOne({ user1Id, user2Id });
    if (existing) throw createError(HTTP.StatusCodes.CONFLICT, 'match already exist');
    const match = await Match.create({
      user1Id,
      user2Id,
      initiatedBy: user1Id,
      status: 'pending',
      compatibilityScore,
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

export const calculateCompatibilityScoresForMatch = async (user1Id, user2Id) => {
  const user1 = await UserServices.getUser(user1Id);
  const user2 = await UserServices.getUser(user2Id);

  let score = 0;
  let details = {};

  const commonLanguages = user1.languagesSpoken.filter(lang =>
    user2.languagesSpoken.includes(lang)
  );
  if (commonLanguages.length > 0) {
    const langScore = commonLanguages.length * 13; 
    score += langScore;
    details.languages = langScore;
  }

  const user1Dest = user1.travelPreferences?.destinations || [];
  const user2Dest = user2.travelPreferences?.destinations || [];
  const commonDest = user1Dest.filter(dest => user2Dest.includes(dest));
  if (commonDest.length > 0) {
    const destScore = commonDest.length * 18; 
    score += destScore;
    details.destinations = destScore;
  }

  const u1Dates = user1.travelPreferences?.travelDates;
  const u2Dates = user2.travelPreferences?.travelDates;
  if (u1Dates && u2Dates) {
    const latestStart = new Date(Math.max(new Date(u1Dates.start), new Date(u2Dates.start)));
    const earliestEnd = new Date(Math.min(new Date(u1Dates.end), new Date(u2Dates.end)));
    if (latestStart <= earliestEnd) {
      score += 24; 
      details.dates = 24;
    }
  }

  const u1Group = user1.travelPreferences?.groupSize;
  const u2Group = user2.travelPreferences?.groupSize;
  if (u1Group && u2Group && Math.abs(u1Group - u2Group) <= 1) {
    score += 16; 
    details.groupSize = 16;
  }

  const u1Age = user1.travelPreferences?.ageRange;
  const u2Age = user2.travelPreferences?.ageRange;
  if (u1Age && u2Age) {
    const overlap = Math.max(0, Math.min(u1Age.max, u2Age.max) - Math.max(u1Age.min, u2Age.min));
    if (overlap > 0) {
      score += 16; 
      details.ageRange = 16;
    }
  }

  const u1Interests = user1.travelPreferences?.interests || [];
  const u2Interests = user2.travelPreferences?.interests || [];
  const commonInterests = u1Interests.filter(i => u2Interests.includes(i));
  if (commonInterests.length > 0) {
    const interestsScore = commonInterests.length * 13; 
    score += interestsScore;
    details.interests = interestsScore;
  }

  if (
    user1.travelPreferences?.travelStyle &&
    user2.travelPreferences?.travelStyle &&
    user1.travelPreferences.travelStyle === user2.travelPreferences.travelStyle
  ) {
    score += 18;
    details.travelStyle = 18;
  }

  if (
    user1.adventureStyle &&
    user2.adventureStyle &&
    user1.adventureStyle === user2.adventureStyle
  ) {
    score += 14; 
    details.adventureStyle = 14;
  }

  if (
    user1.location?.country &&
    user2.location?.country &&
    user1.location.country === user2.location.country
  ) {
    score += 12; 
    details.country = 12;
    if (
      user1.location.city &&
      user2.location.city &&
      user1.location.city === user2.location.city
    ) {
      score += 12; 
      details.city = 12;
    }
  }

  score = Math.max(28, Math.min(score, 99)); 
  return { score, details };
};