import { getPlaceSuggestions, getWeather } from '../services/ai.service.js';
import HTTP from '../constants/status.js';

export const generatePlaceSuggestions = async (req, res, next) => {
  try {
    const { city, country, travelStyle } = req.body;
    const suggestions = await getPlaceSuggestions(city, country, travelStyle);
    res.status(HTTP.StatusCodes.OK).json({ suggestions });
} catch (error) {
    next(error);
  }
};

export const fetchWeather = async (req, res,next) => {
    const { city, country } = req.body;
    try {
      const weatherData = await getWeather(city, country);
      res.status(HTTP.StatusCodes.OK).json(weatherData);
    } catch (error) {
      next(error);
    }
  };