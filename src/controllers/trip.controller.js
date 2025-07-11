import * as TripService from '../services/trip.service.js';
import * as ChatServices from '../services/chat.service.js';

import HTTP from '../constants/status.js';
import { getPlaceSuggestions } from '../services/ai.service.js';

export const createTrip = async (req, res, next) => {
  try {
    const tripData = req.body;
    const newTrip = await TripService.createTrip(tripData);
    TripService.enrichTripWithAI(newTrip._id, tripData).catch((err) => {
      console.error('AI enrichment failed:', err);
    });
    res.status(HTTP.StatusCodes.CREATED).json({ trip: newTrip, aiStatus: 'pending' });
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

export const enrichTripWithAI = async (tripId, tripData) => {
  try {
    const { city, country } = tripData.destination;
    const { travelStyle, travelDates, participants, tags = [] } = tripData;
    const aiText = await getPlaceSuggestions(
      city,
      country,
      travelStyle || 'balanced',
      travelDates,
      participants.length,
      tags
    );
    await TripService.updateTrip(tripId, {
      ai: aiText,
      aiGenerated: true,
    });
  } catch (error) {
    throw error;
  }
};

