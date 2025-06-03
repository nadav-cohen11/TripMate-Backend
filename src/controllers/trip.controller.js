import * as TripService from '../services/trip.service.js';
import HTTP from '../constants/status.js';

export const createTrip = async (req, res, next) => {
  try {
    const trip = await TripService.createTrip(req.body);
    res.status(HTTP.StatusCodes.CREATED).json(trip);
  } catch (error) {
    next(error);
  }
};

export const getTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await TripService.getTrip(tripId);
    res.status(HTTP.StatusCodes.OK).json(trip);
  } catch (error) {
    next(error);
  }
};


export const updateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const tripData = req.body;
    const updated = await TripService.updateTrip(tripId, tripData);
    res.status(HTTP.StatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    await TripService.deleteTrip(req.body.tripId);
    res.status(HTTP.StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const getAllTrips = async (req, res, next) => {
  try {
    const trips = await TripService.getAllTrips();
    res.status(HTTP.StatusCodes.OK).json(trips);
  } catch (error) {
    next(error);
  }
};

export const getAllTripsForUser = async (req, res, next) => {
  try {
    const trips = await TripService.getAllTrips({ 'participants.userId': req.user.id });
    res.status(HTTP.StatusCodes.OK).json(trips);
  } catch (error) {
    next(error);
  }
};

export const getNearbyEvents = async (req, res, next) => {
  const { lat, lon, keyword } = req.query;
  try {
    const events = await TripService.fetchNearbyEvents(lat, lon, keyword);
    res.status(HTTP.StatusCodes.OK).json(events);
  } catch (error) {
    next(error);
  }
};

