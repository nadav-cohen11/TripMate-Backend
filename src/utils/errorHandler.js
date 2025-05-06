import logger from "../config/logger.js";
import HTTP from "../constants/status.js";

export default (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || HTTP.StatusCodes.INTERNAL_SERVER_ERROR;

  logger.error({
    message: err.message,
    statusCode
  });

  res.status(statusCode).json({
    error: {
      message: err.message || 'Internal Server Error',
      statusCode
    },
  });
};