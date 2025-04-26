import * as TripService from '../services/trip.service.js';
import HTTP from '../constants/status.js';
import sendErrorResponse from '../utils/errorHandler.js'

export const createTrip = async (req, res) => {
  try {
    const trip = await TripService.createTrip(req.body);
    return res.status(HTTP.StatusCodes.CREATED).json(trip);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error creating trip',
      error);
  }
};

export const getTrip = async (req, res) => {
  const { tripId } = req.query
  try {
    const trip = await TripService.getTrip(tripId);
    if (!trip) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.NOT_FOUND,
        'Trip not found'
      );
    }
    return res.status(HTTP.StatusCodes.OK).json(trip);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error fetching trip',
      error);
  }
};

export const updateTrip = async (req, res) => {
  const { tripId, tripData } = req.body
  try {
    const trip = await TripService.updateTrip(tripId, tripData);
    if (!trip) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.NOT_FOUND,
        'Trip not found for update');
    }
    return res.status(HTTP.StatusCodes.OK).json(trip);
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error updating trip',
      error
    );
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const deleted = await TripService.deleteTrip(req.body.tripId);
    if (!deleted) {
      return sendErrorResponse(
        res,
        HTTP.StatusCodes.NOT_FOUND,
        'Trip not found for deletion'
      );
    }
    return res.status(HTTP.StatusCodes.OK).json({ message: 'Trip deleted' });
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in deleteTrip',
      error
    );
  }
};

export const getAllTrips = async (req, res) => {
  try {
    const trips = await TripService.getAllTrips(req.query);
    return res.status(HTTP.StatusCodes.OK).json({ trips });
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in getAllTrips',
      error
    );
  }
};
