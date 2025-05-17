import express from 'express';
import * as HotelsController from '../controllers/hotels.controller.js'
import { verifyToken } from '../middlewares/auth.js';
const router = express.Router();

router.get('/getHotels',verifyToken, HotelsController.getHotels);


export default router;
