/**
 * @swagger
 * /api/saveMessage:
 *   post:
 *     summary: Save a new message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: string
 *                 example: "680ca14bea421b1717e84043"
 *               receiverId:
 *                 type: string
 *                 example: "680ca14bea421b1717e84042"
 *               content:
 *                 type: string
 *                 example: "Hello there!"
 *     responses:
 *       201:
 *         description: Message saved successfully
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/getMessage:
 *   get:
 *     summary: Get messages
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: messageId
 *         schema:
 *           type: string
 *           example: "680cf349ff19fc2a4b878cb9"
 *         description: ID of the message to retrieve
 *         required: true
 *     responses:
 *       200:
 *         description: List of messages
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/deleteMessage:
 *   delete:
 *     summary: Delete a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               messageId:
 *                 type: string
 *                 example: "680cf349ff19fc2a4b878cb9"
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/updateMessage:
 *   put:
 *     summary: Update a message
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               messageId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       404:
 *         description: Message not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/getMessageByUser:
 *   get:
 *     summary: Get messages by user
 *     tags: [Messages]
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages for the user
 *       404:
 *         description: No messages found
 *       500:
 *         description: Server error
 */