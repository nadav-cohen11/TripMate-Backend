import Trip from '../models/trip.model.js';

export const createTrip = async (tripData) => {
    try {
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

export const updateTrip = async(tripId,tripData) => {
  try {
    return await Trip.findByIdAndUpdate(tripId,tripData,{new:true})
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
