import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';
import logger from './config/logger.js';
import usersRoutes from './routes/user.route.js'
import matchesRoutes from './routes/match.route.js';
import errorHandler from './utils/errorHandler.js';
import reviewsRoute from './routes/review.route.js';
import tripsRoutes from './routes/trip.route.js';
import messagesRoutes from './routes/message.route.js';
import userPhotoRoutes from './routes/userPhoto.route.js';
import qrRoutes from './routes/qr.routes.js';
import aiRoutes from './routes/ai.routes.js';
import healthRoutes from './routes/health.route.js';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const app = express();

const init = async () => {
    try {
        await connectDB();

        app.use(cors({  origin: process.env.FRONTEND_URL, credentials: true }));
        app.use(express.json());
        app.use(cookieParser());

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.use('/api/health', healthRoutes);
        app.use('/api/users', usersRoutes);
        app.use('/api/matches', matchesRoutes);
        app.use('/api/trips', tripsRoutes);
        app.use('/api/reviews', reviewsRoute);
        app.use('/api/messages', messagesRoutes);
        app.use('/api/media', userPhotoRoutes);
        app.use('/api/qr', qrRoutes);
        app.use('/api/ai', aiRoutes);
        app.use(errorHandler)
        

        logger.info('app initialized');
    } catch (error) {
        logger.error('Error during app initialization:', error);
        process.exit(1);
    }
};

init();

export default app;
