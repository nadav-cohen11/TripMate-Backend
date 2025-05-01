import app from './src/app.js';
import * as dotenv from 'dotenv';
import logger from './src/config/logger.js';
dotenv.config({ path: '.env' });
import http from 'http';
import { Server } from 'socket.io';
import * as ChatServices from './src/services/chat.service.js'

const PORT = process.env.BACKEND_PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('joinChat', ({chatId}) => {
    socket.join(chatId)
    console.log(`User joined chat ${chatId}`);
  })

  socket.on('getChats', async ({ userId }, callback) => {
    const chats = await ChatServices.getChatsByUser(userId);
    callback(chats)
  });


  socket.on('sendMessage', async ({ chatId, msg }) => {
    await ChatServices.createMessage(chatId, msg)

    io.to(chatId).emit('messageReceived', msg)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', message => {
    console.log(message)
  })
});

server.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
