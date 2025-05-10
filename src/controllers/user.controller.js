import * as UserServices from '../services/user.service.js';
import HTTP from '../constants/status.js';
import jwt from 'jsonwebtoken';

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
    res.status(HTTP.StatusCodes.OK).json({ message: 'Login successful',id: user.id });
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const user = await UserServices.createUser(req.body);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000,
    });
    res.status(HTTP.StatusCodes.CREATED).json({ message: 'Registration successful', id: user.id });
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
    if (!latitude || !longitude) {
      return res.status(HTTP.StatusCodes.OK).json({ message: 'Missing coordinates' });
    }
    await UserServices.updateUserLocation(req.user.id, latitude, longitude);
    res.status(HTTP.OK).json({ message: 'Location updated' });
  } catch (error) {
    next(error);
  }
};

export const getUserLocation = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userLocation = await UserServices.getUserCordinates(userId);
    res.status(HTTP.StatusCodes.OK).json(userLocation);
  } catch (error) {
    next(error);
  }
};

