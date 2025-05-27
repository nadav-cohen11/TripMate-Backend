import express from 'express';
import * as TripController from '../controllers/trip.controller.js';
const router = express.Router();

router.post('/createTrip', TripController.createTrip);
router.get('/events', TripController.getNearbyEvents);
router.get('/:tripId', TripController.getTrip);
router.put('/:tripId', TripController.updateTrip);
router.delete('/:tripId', TripController.deleteTrip);
router.get('/', TripController.getAllTrips);

export default router;
