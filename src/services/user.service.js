import HTTP from '../constants/status.js';
import createError from 'http-errors';
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'

export const login = async (email, password) => {
  try {
    const user = await User.findOne({ email }).lean();
    if (!user) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    delete user.password
    return user;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const existEmail = await User.findOne({ email: userData.email }).lean();
    if (existEmail) throw createError(HTTP.StatusCodes.CONFLICT, 'Email already in use');

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    const user = new User(userData);
    await user.save();
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

export const deleteUser = async (userId) => {
  try {
    const deleted = await User.findByIdAndDelete(userId);
    if (!deleted) throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
    return deleted;
  } catch (error) {
    throw error
  }
}

export const updateUser = async (userId, userData) => {
  try {
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