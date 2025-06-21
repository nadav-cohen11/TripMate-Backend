import HTTP from '../constants/status.js';
import createError from 'http-errors';
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { isValidCoordinates } from '../utils/cordinatesValidator.js';
import logger from '../config/logger.js';
import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tripmate02@gmail.com',
    pass: process.env.MAIL_PASSWORD
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  pool: false,
  maxConnections: 1,
  maxMessages: 1
});

export const login = async (email, password, location) => {
  try {
    logger.info("location", location)
    const user = await User.findOne({ email });
    if (!user) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid email or password');
    if (location.length === 0 || !isValidCoordinates(location)) {
      user.location.coordinates = [ 31.96516656696053, 34.79766117754824 ]; 
      await user.save();
    }
    else {
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
    else {
      userData.location.coordinates = [ 31.96516656696053, 34.79766117754824 ];
    }

    const newUser = new User({
      ...userData,
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [location.coordinates[0], location.coordinates[1]],
      },
      socialLinks: {
        instagram: userData.instagram || '',
        facebook: userData.facebook || '',
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

export const updateUser = async (userId, { userData }) => {
  try {
    const userToUpdate = await User.findById(userId);
    if (userToUpdate.location && userData.location) {
      userData.location.coordinates = userToUpdate.location.coordinates;
    }
    const user = await User.findByIdAndUpdate(userId, userData, { new: true }).lean();
    if (!user) {
      throw createError(HTTP.StatusCodes.NOT_FOUND, 'User not found');
    }
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
  if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number' || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
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

export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email })
    if (user) return user
    return null
  } catch (error) {
    throw error
  }
}

export const sendWelcomeEmail = async (toEmail, name) => {
  try {
    const mailOptions = {
      from: '"TripMate" <noreply@tripmate.com>',
      to: toEmail,
      subject: 'Welcome to TripMate!',
      text: `Hi ${name},`,
      html: `
        <div style="font-family: Arial, sans-serif; background: #f6f8fa; padding: 40px;">
          <div style="max-width: 500px; margin: auto; background: #fff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); padding: 32px;">
            <div style="text-align: center;">
              <img src="https://res.cloudinary.com/dnpsnkuyi/image/upload/v1750433782/TripMate_logo_x0hndn.png" alt="TripMate Logo" style="width: 150px; margin-bottom: 16px;" />
              <h1 style="color: #2d7ff9; margin-bottom: 8px;">Welcome to TripMate, ${name}!</h1>
            </div>
            <p style="font-size: 16px; color: #333;">
              We're thrilled to have you join our travel community. With TripMate, you can connect with fellow travelers, share your adventures, and discover new destinations.
            </p>
            <p style="font-size: 16px; color: #333;">
              Start exploring now and make your next trip unforgettable!
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="https://tripmateapp.cloud" style="background: #2d7ff9; color: #fff; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
                Get Started
              </a>
            </div>
            <p style="font-size: 14px; color: #888; text-align: center;">
              If you have any questions, just send us email to tripmate0506@gmail.com we are here to help!
            </p>
          </div>
        </div>
      `
    };
    
    // Add timeout promise to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email sending timeout')), 15000); // 15 second timeout
    });
    
    const sendPromise = transporter.sendMail(mailOptions);
    
    // Race between sending email and timeout
    const result = await Promise.race([sendPromise, timeoutPromise]);
    
    logger.info(`Welcome email sent successfully to ${toEmail}`);
    return result;
  } catch (error) {
    logger.error('Error sending welcome email:', error);
    // Don't throw the error, just log it to prevent blocking the registration
    return null;
  }
};