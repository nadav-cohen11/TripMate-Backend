import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import logger from './config/logger.js';
import userRoutes from './routes/user.route.js'
import matchRoutes from './routes/match.route.js';
import reviewsRoute from './routes/review.route.js'
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();

const init = async () => {
    try {
        await connectDB();
        app.use(cors({ origin: `http://localhost:${process.env.FRONTEND_PORT}`, credentials: true }));
        app.use(express.json());
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.use('/api', userRoutes);
        app.use('/api/matches', matchRoutes)
        app.use('/api/reviews', reviewsRoute)
        logger.info('app initialized');
    } catch (error) {
        logger.error('Error during app initialization:', error);
        process.exit(1);
    }
};

init();

export default app;
