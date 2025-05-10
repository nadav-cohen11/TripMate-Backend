/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Reviews management and operations
 */

/**
 * @swagger
 * /api/reviews/createReview:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reviewerId
 *               - revieweeId
 *               - rating
 *             properties:
 *               reviewerId:
 *                 type: string
 *                 description: ID of the reviewer (the user who is giving the review).
 *               revieweeId:
 *                 type: string
 *                 description: ID of the user being reviewed.
 *               tripId:
 *                 type: string
 *                 description: ID of the trip related to the review (optional).
 *               rating:
 *                 type: integer
 *                 description: Rating given to the reviewee, from 1 to 5.
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 description: Optional comment for the review.
 *                 maxLength: 2000
 *     responses:
 *       201:
 *         description: Review successfully created
 *       400:
 *         description: Bad request, invalid data
 */

/**
 * @swagger
 * /api/reviews/userReviews/{reviewId}:
 *   get:
 *     summary: Get a review by ID
 *     tags: [Reviews]
 *     description: Retrieve a review by its ID.
 *     parameters:
 *       - name: reviewId
 *         in: path
 *         required: true
 *         description: The ID of the review to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *       400:
 *         description: Review not found or invalid ID
 */

/**
 * @swagger
 * /api/reviews/userReviews/{userId}:
 *   get:
 *     summary: Get all reviews for a user
 *     tags: [Reviews]
 *     description: Retrieve all reviews for a specific user.
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: The ID of the user whose reviews you want to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the user
 *       400:
 *         description: Invalid user ID or no reviews found
 */

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the review to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Updated review: excellent experience."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rewiewId:
 *                 type: string
 *                 example: "660c0e45ec293292e4c2c123"
 *     responses:
 *       200:
 *         description: Review successfully deleted
 *       400:
 *         description: Review not found or invalid ID
 */