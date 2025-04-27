/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided data.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               fullName:
 *                 type: string
 *               birthDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/getUser/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     description: Fetches the user data based on the provided user ID.
 *     tags: [User]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/getAllUsers:
 *   get:
 *     summary: Get all users
 *     description: Retrieves all users.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/deleteUser:
 *   delete:
 *     summary: Delete a user by ID
 *     description: Deletes a user based on the provided user ID.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/updateUser:
 *   put:
 *     summary: Update user data
 *     description: Updates the user's information with the provided data.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               userData:
 *                 type: object
 *                 additionalProperties: true
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user with the provided email and password.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
