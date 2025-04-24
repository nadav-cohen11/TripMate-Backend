import app from './src/app.js';
import * as dotenv from 'dotenv';
import logger from './src/config/logger.js';

dotenv.config({ path: '.env' });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
