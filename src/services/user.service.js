import HTTP from '../constants/status.js';
import createError from 'http-errors';
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { isValidCoordinates } from '../utils/cordinatesValidator.js';

export const login = async (email, password, location) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    if (!isValidCoordinates(location)) {
      user.location.coordinates = location;
      await user.save();
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const existing = await User.findOne({ email: userData.email }).lean();
    if (existing) throw createError(HTTP.StatusCodes.CONFLICT, 'Email already in use');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const location = userData.location;
    
    if (!location) {
      throw createError(HTTP.StatusCodes.BAD_REQUEST, 'Invalid or missing location');
    }

    const newUser = new User({
      ...userData,
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [location.coordinates[0], location.coordinates[1]],
      },
    });
    

    const savedUser = await newUser.save();
    delete savedUser.password;
    return savedUser;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
    return deleted;
  } catch (error) {
    throw error
  }
}

export const updateUser = async (userId, {userData}) => {
  try {
    const userToUpdate = await User.findById(userId)
    userData.location.coordinates = userToUpdate.location.coordinates
    const user = await User.findByIdAndUpdate(userId, userData, { new: true }).lean();
    if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
    return user;
  } catch (error) {
    throw error
  }
}

export const getAllUsers = async () => {
  try {
    return await User.find({}).select('-password');
  } catch (error) {
    throw error
  }
}

export const updateUserLocation = async (userId, latitude, longitude) => {
  if ( !latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number' ||  latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw createError(HTTP.StatusCodes.NOT_FOUND, 'Invalid coordinates');
  }
  return await User.findOneAndUpdate(
    { userId },
    {
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
      updatedAt: new Date(),
    }
  );
};

export const getUserCoordinates = async (userId) => {
  try {
    const userLocation = await User.findById(userId).select('location');
    if (!userLocation) throw createError(HTTP.StatusCodes.NOT_FOUND, 'Location not found');
    return userLocation;
  } catch (error) {
    throw error;
  }
}

export const getUsersLocations = async () => {
  try {
    const userLocation = await User.find({ location: { $exists: true } }).select('location.coordinates photos fullName socialLinks ')
    if (!userLocation) throw createError(HTTP.StatusCodes.NOT_FOUND, []);
    return userLocation;
  } catch (error) {
    throw error;
  }
};

