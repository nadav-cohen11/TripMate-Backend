import Trip from '../models/trip.model.js';
import axios from 'axios';

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

export const getTripSuggestion = async (tripId) => {
  try {
    if (!tripId) throw new Error('Trip ID is required');
    const trip = await getTrip(tripId);
    if (!trip || !trip.destination) {
      throw new Error('Trip or trip destination not found');
    }
    const { country, city } = trip.destination;
    if (!country || typeof country !== 'string' || !country.trim()) {
      throw new Error('Trip destination country is required and must be a non-empty string');
    }
    if (!city || typeof city !== 'string' || !city.trim()) {
      throw new Error('Trip destination city is required and must be a non-empty string');
    }
    const geocodeUrl = `https://nominatim.openstreetmap.org/search`;
    const geocodeParams = {
      country,
      city,
      format: 'json',
      limit: 1,
    };
    const geocodeResponse = await axios.get(geocodeUrl, { params: geocodeParams });
    if (!Array.isArray(geocodeResponse.data) || !geocodeResponse.data.length) {
      throw new Error('Could not geocode city and country');
    }
    const { lat, lon } = geocodeResponse.data[0];
    if (!lat || !lon) {
      throw new Error('Geocoding did not return valid coordinates');
    }
    const keyword = 'beach';
    const radius = 10000;

    if (!process.env.OPENTRIPMAP_API_KEY) {
      throw new Error('OpenTripMap API key is missing');
    }

    const url = `https://api.opentripmap.com/0.1/en/places/autosuggest`;
    const params = {
      name: keyword,
      radius,
      lon,
      lat,
      apikey: process.env.OPENTRIPMAP_API_KEY,
    };

    const response = await axios.get(url, { params });
    if (!response.data || !Array.isArray(response.data.features) || !response.data.features.length) {
      throw new Error('No suggestions found for the given location');
    }
    const features = response.data.features;
    const shuffeled = shuffle(features);
    return shuffeled[0].properties;
  } catch (error) {
    throw error;
  }
}


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

export const fetchNearbyEvents = async (lat, lon, keyword) => {
  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    const url = 'https://app.ticketmaster.com/discovery/v2/events.json';
    const params = {
      apikey: apiKey,
      latlong: `${lat},${lon}`,
      radius: 5000,
      unit: 'km',
    };

    const response = await axios.get(url, { params });
    const events = response.data._embedded?.events || [];

    return events;
  } catch (error) {
    throw error;
  }
};


const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}