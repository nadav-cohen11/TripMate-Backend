import mongoose from 'mongoose';
import logger from '../config/logger.js';

const checkHealth = async () => {
    try {
        const healthData = {
            status: 'OK',
            message: 'Server is running',
            timestamp: new Date().toISOString()
        };

        try {
            const dbState = mongoose.connection.readyState;
            if (dbState === 1) {
                healthData.database = 'connected';
            } else {
                healthData.database = 'disconnected';
                healthData.status = 'WARNING';
            }
        } catch (dbError) {
            healthData.database = 'error';
            healthData.status = 'WARNING';
            logger.warn('Database health check failed:', dbError);
        }

        logger.info('Health check OK', { healthData });
        return { success: true, data: healthData };
    } catch (error) {
        logger.error('Health check failed:', error);
        return { 
            success: false, 
            error: 'Health check failed',
            timestamp: new Date().toISOString()
        };
    }
};

export default {
    checkHealth
}; 