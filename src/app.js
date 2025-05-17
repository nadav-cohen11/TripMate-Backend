import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import logger from './config/logger.js';
import usersRoutes from './routes/user.route.js'
import matchesRoutes from './routes/match.route.js';
import errorHandler from './utils/errorHandler.js';
import reviewsRoute from './routes/review.route.js'
import tripsRoutes from './routes/trip.route.js'
import messagesRoutes from './routes/message.route.js'
import cookieParser from 'cookie-parser';
import hotelsRoute from './routes/hotels.route.js'
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();

const init = async () => {
    try {
        await connectDB();
        app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
        app.use(express.json());
        app.use(cookieParser());

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.use('/api/users', usersRoutes);
        app.use('/api/matches', matchesRoutes);
        app.use('/api/trips', tripsRoutes);
        app.use('/api/reviews', reviewsRoute);
        app.use('/api/messages', messagesRoutes)
        app.use('/api/hotels', hotelsRoute);

        
        app.use(errorHandler)

        logger.info('app initialized');
    } catch (error) {
        logger.error('Error during app initialization:', error);
        process.exit(1);
    }
};

init();

export default app;
