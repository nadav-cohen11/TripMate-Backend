import express from 'express';
import healthController from '../controllers/health.controller.js';

const router = express.Router();

// Health check endpoint
router.get('/', healthController.getHealth);

export default router; 