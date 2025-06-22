/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check the health status of the server and database connection
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 message:
 *                   type: string
 *                   example: "Server is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 database:
 *                   type: string
 *                   example: "connected"
 *       500:
 *         description: Server health check failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ERROR"
 *                 message:
 *                   type: string
 *                   example: "Health check failed"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */ 