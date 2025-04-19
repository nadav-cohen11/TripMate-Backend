import logger from "../config/logger.js";

const sendErrorResponse = (res, statusCode, message, details = null) => {
  logger.error(message, details);
  return res.status(statusCode).json({ error: message });
};

export default sendErrorResponse;