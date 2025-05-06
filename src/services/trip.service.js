import Trip from '../models/trip.model.js';
import createError from 'http-errors';
import HTTP from '../constants/status.js';

export const createTrip = async (tripData) => {
  try {
    const trip = Trip.create(tripData);
    return trip;
  } catch (error) {
    throw error;
  }
};

export const getTrip = async (tripId) => {
  try {
    const trip = await Trip.findById(tripId).populate('host participants.userId')
    if (!trip) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Trip not found')
    return trip;
  } catch (error) {
    throw error;
  }
};

export const updateTrip = async (tripId, tripData) => {
  try {
    const trip = await Trip.findByIdAndUpdate(tripId, tripData, { new: true });
    if (!trip) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Trip not found');
    return trip;
  } catch (error) {
    throw error
  }
}

export const deleteTrip = async (tripId) => {
  try {
    const deleted = await Trip.findByIdAndDelete(tripId);
    if (!deleted) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Trip not found');
    return deleted;
  } catch (error) {
    throw error;
  }
}

export const getAllTrips = async () => {
  try {
    return await Trip.find({});
  } catch (error) {
    throw error;
  }
};
