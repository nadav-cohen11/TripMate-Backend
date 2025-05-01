import app from './src/app.js';
import * as dotenv from 'dotenv';
import logger from './src/config/logger.js';
dotenv.config({ path: '.env' });
import http from 'http';
import { Server } from 'socket.io';
import * as ChatServices from './src/services/chat.service.js'
import { getConfirmedMatches } from './src/services/match.service.js';
import mongoose from 'mongoose';

const PORT = process.env.BACKEND_PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('getChats', async ({ userId }, callback) => {
    // const userObjectId = new mongoose.Types.ObjectId(userId)
    // const matches = await getConfirmedMatches(userId)
    // let chats = []
    // if (matches) {
    //   chats = matches.filter((match) => {
    //     return (
    //       match.user1Id && match.user2Id
    //     )
    //   })
    // }
    // chats = chats.map(chat => {
    //   if (!chat.user1Id.equals(userObjectId)) {
    //     return chat.user1Id
    //   }
    //   return chat.user2Id
    // })
    const chats = await ChatServices.getChatsByUser(userId);
    
    console.log(chats)

    

    callback(chats)
  });



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
