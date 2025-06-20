import * as UserServices from '../services/user.service.js';
import HTTP from '../constants/status.js';
import jwt from 'jsonwebtoken';
import {getGroupChatsByUser} from '../services/chat.service.js'
import logger from '../config/logger.js';

export const login = async (req, res, next) => {
  try {
    const { email, password, location } = req.body;
    const user = await UserServices.login(email, password, location);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000,
    });
    logger.info('Login successful', user._id);
    res.status(HTTP.StatusCodes.OK).json({ id: user._id });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {

    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
    });
    res.sendStatus(HTTP.StatusCodes.OK);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await UserServices.createUser(req.body);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000,
    });
    logger.info('Registration successful1', user._id);
    res.status(HTTP.StatusCodes.CREATED).json({ message: 'Registration successful', id: user._id });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await UserServices.getUser(req.user.id);
    res.status(HTTP.StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserServices.getUser(req.params.userId);
    res.status(HTTP.StatusCodes.OK).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserLoggedIn = async (req, res, next) => {
  try {
    const userId = req.user.id
    return res.status(HTTP.StatusCodes.OK).json(userId);
  } catch (error) {
    next(error)
  };
}

export const deleteUser = async (req, res, next) => {
  try {
    await UserServices.deleteUser(req.user.id);
    res.status(HTTP.StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const updated = await UserServices.updateUser(req.user.id, req.body);
    res.status(HTTP.StatusCodes.OK).json(updated);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await UserServices.getAllUsers();
    res.status(HTTP.StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.body;
    await UserServices.updateUserLocation(req.user.id, latitude, longitude);
    res.status(HTTP.StatusCodes.OK).json({ message: 'Location updated' });
  } catch (error) {
    next(error);
  }
};

export const getUserLocation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userLocation = await UserServices.getUserCoordinates(userId);
    res.status(HTTP.StatusCodes.OK).json(userLocation);
  } catch (error) {
    next(error);
  }
};

export const getUserLocations = async (req, res, next) => {
  try {
    const users = await UserServices.getUsersLocations();
    res.status(HTTP.StatusCodes.OK).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserByEmail = async (req, res, next) => {
  try {
    const user = await UserServices.getUserByEmail(req.query.email);
    if (user) return res.status(HTTP.StatusCodes.OK).json(user);
    return res.sendStatus(HTTP.StatusCodes.NOT_FOUND)
  } catch (error) {
    next(error);
  }
};

export const getAllGroupChats = async (req, res) => {
  try {
    const groupChats = await getGroupChatsByUser(req.user.id);
    return res.status(HTTP.StatusCodes.OK).json(groupChats);
  } catch (error) {
    next(error);
  }
};