import Trip from '../models/trip.model.js';

export const createTrip = async (tripData) => {
  try {
    if (Array.isArray(tripData.participants)) {
      tripData.participants = tripData.participants.map(participant => {
        if (participant._id && !participant.userId) {
          const { _id, ...rest } = participant;
          return { ...rest, userId: _id };
        }
        return participant;
      });
    }
    const trip = new Trip(tripData);
    await trip.save();
    return trip;
  } catch (error) {
    throw error;
  }
};

export const getTrip = async (tripId) => {
  try {
    return await Trip.findById(tripId).populate('host participants.userId')
  } catch (error) {
    throw error;
  }
};

export const updateTrip = async (tripId, tripData) => {
  try {
    return await Trip.findByIdAndUpdate(tripId, tripData, { new: true })
  } catch (error) {
    throw error
  }
}

export const deleteTrip = async (tripId) => {
  try {
    return await Trip.findByIdAndDelete(tripId)
  } catch (error) {
    throw error
  }
}

export const getAllTrips = async (filter = {}) => {
  try {
    return await Trip.find(filter).populate('host participants.userId');
  } catch (error) {
    throw error;
  }
};

export const unactiveUserFromTrip = async (tripId, userId) => {
  try {
    const trip = await Trip.findOne({ _id: tripId });
    if (!trip) {
      throw new Error('Trip not found');
    }
    trip.participants = trip.participants.map(participant => {
      if (participant.userId.toString() === userId.toString()) {
        return { ...participant.toObject(), isConfirmed: false };
      }
      return participant;
    });
    await trip.save();
    if (!trip) {
      throw new Error('Trip not found');
    }
    return trip;
  } catch (error) {
    throw error;
  }
};