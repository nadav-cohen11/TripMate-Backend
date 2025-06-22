import healthService from '../services/health.service.js';
import HTTP from '../constants/status.js';

const getHealth = async (req, res) => {
    try {
        const result = await healthService.checkHealth();
        
        if (result.success) {
            res.status(HTTP.StatusCodes.OK).json(result.data);
        } else {
            res.status(HTTP.StatusCodes.INTERNAL_SERVER_ERROR).json({
                status: 'ERROR',
                message: result.error,
                timestamp: result.timestamp
            });
        }
    } catch (error) {
        res.status(HTTP.StatusCodes.INTERNAL_SERVER_ERROR).json({
            status: 'ERROR',
            message: 'Health check failed',
            timestamp: new Date().toISOString()
        });
    }
};

export default {
    getHealth
}; 