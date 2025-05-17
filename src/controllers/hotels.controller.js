import * as HotelsService from '../services/hotels.service.js';
import HTTP from '../constants/status.js';
import { getUser } from '../services/user.service.js';

export const getHotels = async (req, res, next) => {
  try {
    const user = await getUser(req.user.id)
    const [lat, lan] = user.location.coordinates
    const hotels = await HotelsService.searchHotelsByCoordinates(lat, lan)
    res.status(HTTP.StatusCodes.CREATED).json(hotels);
  } catch (error) {
    next(error);
  }
};
