import jwt from 'jsonwebtoken';
import HTTP from '../constants/status.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return next(createError(HTTP.StatusCodes.UNAUTHORIZED, 'Access token missing'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(createError(HTTP.StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
  }
};
