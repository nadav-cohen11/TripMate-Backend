import express from 'express';
import * as QrControllers from '../controllers/qr.controller.js';

const router = express.Router();

router.get('/:userId', QrControllers.getUserQRCode);

export default router;
