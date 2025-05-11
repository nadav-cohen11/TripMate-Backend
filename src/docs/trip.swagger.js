/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: API endpoints for managing trips
 */

/**
 * @swagger
 * /api/trips/createTrip:
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

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: API endpoints for managing trips
 */

/**
 * @swagger
 * /api/trips/{tripId}:
 *   put:
 *     summary: Update a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the trip to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               destination:
 *                 type: object
 *                 properties:
 *                   country:
 *                     type: string
 *                   city:
 *                     type: string
 *                   location:
 *                     type: object
 *                     properties:
 *                       type:
 *                         type: string
 *                         enum: [Point]
 *                       coordinates:
 *                         type: array
 *                         items:
 *                           type: number
 *                         minItems: 2
 *                         maxItems: 2
 *               travelDates:
 *                 type: object
 *                 properties:
 *                   start:
 *                     type: string
 *                     format: date
 *                   end:
 *                     type: string
 *                     format: date
 *               groupSize:
 *                 type: integer
 *               description:
 *                 type: string
 *               itinerary:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day:
 *                       type: integer
 *                     activity:
 *                       type: string
 *               participants:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     status:
 *                       type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             destination:
 *               country: "Italy"
 *               city: "Rome"
 *               location:
 *                 type: "Point"
 *                 coordinates: [12.4964, 41.9028]
 *             travelDates:
 *               start: "2025-06-01"
 *               end: "2025-06-10"
 *             groupSize: 4
 *             description: "Rome summer adventure"
 *             itinerary:
 *               - day: 1
 *                 activity: "Visit the Colosseum"
 *               - day: 2
 *                 activity: "Tour the Vatican"
 *             participants:
 *               - userId: "6630e3f5b7c95e1a3f8b4a12"
 *                 status: "confirmed"
 *             tags: ["history", "culture"]
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/trips/{tripId}:
 *   get:
 *     summary: Get a trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
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

/**
 * @swagger
 * /api/trips/{tripId}:
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
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *         content:
 *           application/json:
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/trips/{tripId}:
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
 *       204:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/trips/:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     description: A list of trips
 *     responses:
 *       200:
 *         description: Trip data
 *       400:
 *         description: Bad request
 */

