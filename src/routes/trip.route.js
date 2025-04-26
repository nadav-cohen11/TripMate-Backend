import express from 'express';
import * as TripController from '../controllers/trip.controller.js';

const router = express.Router();

router.post('/createTrip', TripController.createTrip);
router.get('/getTrip', TripController.getTrip);
router.put('/updateTrip', TripController.updateTrip);
router.delete('/deleteTrip', TripController.deleteTrip);

export default router;
