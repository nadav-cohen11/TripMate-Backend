import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import swaggerUi from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import swaggerSpec from './docs/swagger.js';
import logger from './config/logger.js';
import errorHandler from './utils/errorHandler.js';
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
        app.use(cookieParser());

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        app.use('/api/users', userRoutes);
        app.use('/api/matches', matchRoutes)
        app.use('/api/reviews', reviewsRoute)

        app.use(errorHandler)


        logger.info('app initialized');
    } catch (error) {
        logger.error('Error during app initialization:', error);
        process.exit(1);
    }
};

init();

export default app;
