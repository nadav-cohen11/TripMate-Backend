import express from 'express';
import * as TripController from '../controllers/trip.controller.js';

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: API endpoints for managing trips
 */

const router = express.Router();
/**
 * @swagger
 * /api/createTrip:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               host:
 *                 type: string
 *                 example: "6630e3f5b7c95e1a3f8b4a12"
 *               name:
 *                 type: string
 *               destination:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               participants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     isConfirmed:
 *                       type: boolean
 *                     joinedAt:
 *                       type: string
 *                       format: date-time
 *           example:
 *             host: "6630e3f5b7c95e1a3f8b4a12"
 *             name: "Summer Vacation"
 *             destination: "Paris"
 *             startDate: "2024-07-01"
 *             endDate: "2024-07-10"
 *             participants:
 *               - userId: "680ca14bea421b1717e84042"
 *                 isConfirmed: true
 *                 joinedAt: "2024-06-01T10:00:00Z"
 *               - userId: "680ca14bea421b1717e84045"
 *                 isConfirmed: false
 *                 joinedAt: "2024-06-02T12:00:00Z"
 *     responses:
 *       201:
 *         description: Trip created successfully
 *       400:
 *         description: Bad request
 */
router.post('/createTrip', TripController.createTrip);


/**
 * @swagger
 * /api/getTrip:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: query
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to fetch
 *     responses:
 *       200:
 *         description: Trip data
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Bad request
 */
router.get('/getTrip', TripController.getTrip);

/**
 * @swagger
 * /api/updateTrip:
 *   put:
 *     summary: Update a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: 'back/src/models/trip.model.js'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Bad request
 */
router.put('/updateTrip', TripController.updateTrip);

/**
 * @swagger
 * /api/deleteTrip:
 *   delete:
 *     summary: Delete a trip by ID
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tripId:
 *                 type: string
 *                 example: "660c0e45ec293292e4c2c123"
 *           example:
 *             tripId: "660c0e45ec293292e4c2c123"
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Bad request
 */
router.delete('/deleteTrip', TripController.deleteTrip);

export default router;
