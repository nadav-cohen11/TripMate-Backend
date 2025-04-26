/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Match management and operations
 */

/**
 * @swagger
 * /api/matches:
 *   post:
 *     summary: Request or accept a match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user1Id, user2Id, tripId]
 *             properties:
 *               user1Id:
 *                 type: string
 *                 description: ID of the user initiating the match
 *                 example: "68050945a4128a0c98227597"
 *               user2Id:
 *                 type: string
 *                 description: ID of the second user
 *                 example: "680511f56160a4bb7a61628d"
 *               tripId:
 *                 type: string
 *                 description: Trip ID if relevant
 *                 example: "680a67e4b88b2d23558aaf3b"
 *               scores:
 *                 type: object
 *                 properties:
 *                   compatibilityScore:
 *                     type: number
 *                     example: 8.5
 *                   locationProximityScore:
 *                     type: number
 *                     example: 7.0
 *                   sharedInterestsScore:
 *                     type: number
 *                     example: 9.0
 *     responses:
 *       201:
 *         description: Match created or accepted
 *       400:
 *         description: Match already exists or error occurred
 */

/**
 * @swagger
 * /api/matches/confirmed/{userId}:
 *   get:
 *     summary: Get all confirmed matches for a user
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user
 *         example: "68050945a4128a0c98227597"
 *     responses:
 *       200:
 *         description: List of confirmed matches
 */

/**
 * @swagger
 * /api/matches/pending/received/{userId}:
 *   get:
 *     summary: Get all pending matches received by the user
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the receiving user
 *         example: "680511f56160a4bb7a61628d"
 *     responses:
 *       200:
 *         description: List of pending received matches
 */

/**
 * @swagger
 * /api/matches/pending/sent/{userId}:
 *   get:
 *     summary: Get all pending matches sent by the user
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the sender user
 *         example: "68050945a4128a0c98227597"
 *     responses:
 *       200:
 *         description: List of pending sent matches
 */

/**
 * @swagger
 * /api/matches/decline/{matchId}:
 *   post:
 *     summary: Decline a match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: string
 *         required: true
 *         description: Match ID to decline
 *         example: "680a67e4b88b2d23558aaf3b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user declining the match
 *                 example: "68050945a4128a0c98227597"
 *     responses:
 *       200:
 *         description: Match declined
 *       403:
 *         description: Unauthorized or match not found
 */

/**
 * @swagger
 * /api/matches/unmatch:
 *   post:
 *     summary: Unmatch two users from a trip
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user1Id, user2Id, tripId]
 *             properties:
 *               user1Id:
 *                 type: string
 *                 example: "68050945a4128a0c98227597"
 *               user2Id:
 *                 type: string
 *                 example: "680511f56160a4bb7a61628d"
 *               tripId:
 *                 type: string
 *                 example: "680a67e4b88b2d23558aaf3b"
 *     responses:
 *       204:
 *         description: Unmatched successfully
 *       400:
 *         description: Error while unmatching
 */

/**
 * @swagger
 * /api/matches/block/{matchId}:
 *   post:
 *     summary: Block a match
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: string
 *         required: true
 *         description: Match ID to block
 *         example: "680a67e4b88b2d23558aaf3b"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "68050945a4128a0c98227597"
 *     responses:
 *       200:
 *         description: Match blocked
 *       403:
 *         description: Unauthorized
 */
