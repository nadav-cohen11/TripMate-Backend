import jwt from 'jsonwebtoken';
import HTTP from '../utils/errorHandler.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(HTTP.StatusCodes.UNAUTHORIZED).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return sendErrorResponse(
      res,
      HTTP.StatusCodes.BAD_REQUEST,
      'Error in verifyToken',
      error
    );
  }
};
