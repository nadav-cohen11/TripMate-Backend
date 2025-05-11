import Trip from '../models/trip.model.js';

const validateTripData = (tripData) => {
  if (!tripData) throw new Error('Trip data is required');
  if (!tripData.host) throw new Error('Trip host is required');
  if (!Array.isArray(tripData.participants)) throw new Error('Participants must be an array');
};

export const createTrip = async (tripData) => {
  try {
    validateTripData(tripData);
    tripData.participants = tripData.participants.map(participant => {
      if (participant._id && !participant.userId) {
        const { _id, ...rest } = participant;
        return { ...rest, userId: _id };
      }
      return participant;
    });
    const trip = new Trip(tripData);
    await trip.save();
    return trip;
  } catch (error) {
    throw error;
  }
};

export const getTrip = async (tripId) => {
  try {
    if (!tripId) throw new Error('Trip ID is required');
    return await Trip.findById(tripId).populate('host participants.userId');
  } catch (error) {
    throw error;
  }
};

export const updateTrip = async (tripId, tripData) => {
  try {
    if (!tripId) throw new Error('Trip ID is required');
    if (!tripData) throw new Error('Trip data is required');
    return await Trip.findByIdAndUpdate(tripId, tripData, { new: true });
  } catch (error) {
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    if (!tripId) throw new Error('Trip ID is required');
    return await Trip.findByIdAndDelete(tripId);
  } catch (error) {
    throw error;
    throw error;
  }
};

export const getAllTrips = async (filter = {}) => {
  try {
    if (typeof filter !== 'object') throw new Error('Filter must be an object');
    return await Trip.find(filter).populate('host participants.userId');
  } catch (error) {
    throw error;
  }
};

export const unactiveUserFromTrip = async (tripId, userId) => {
  try {
    if (!tripId) throw new Error('Trip ID is required');
    if (!userId) throw new Error('User ID is required');
    const trip = await Trip.findOne({ _id: tripId });
    if (!trip) throw new Error('Trip not found');
    trip.participants = trip.participants.map(participant => {
      if (
        participant.userId &&
        userId &&
        participant.userId.toString() === userId.toString()
      ) {
        return { ...participant.toObject(), isConfirmed: false };
      }
      return participant;
    });
    await trip.save();
    return trip;
  } catch (error) {
    throw error;
  }
};