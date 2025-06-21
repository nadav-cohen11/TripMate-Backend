import express from 'express';
import { generatePlaceSuggestions, fetchWeather } from '../controllers/ai.controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post('/place-suggestions', verifyToken, generatePlaceSuggestions);
router.post('/current-weather', verifyToken, fetchWeather);

export default router;
