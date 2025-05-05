import app from './src/app.js';
import * as dotenv from 'dotenv';
import logger from './src/config/logger.js';
import http from 'http';
import { initSocket } from './src/config/socket.js';

dotenv.config({ path: '.env' });

const PORT = process.env.BACKEND_PORT;

const server = http.createServer(app);

initSocket(server)

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
