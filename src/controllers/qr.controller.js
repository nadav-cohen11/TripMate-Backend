import * as QRService from '../services/qr.service.js';
import createError from 'http-errors';
import HTTP from '../constants/status.js'

export const getUserQRCode = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId) throw createError(HTTP.BAD_REQUEST, 'Missing userId for QR code');
    
    const qrCode = await QRService.generateUserQRCode(userId);
    res.status(HTTP.StatusCodes.OK).json({ qrCode }); 
  } catch (err) {
    next(err);
  }
};
