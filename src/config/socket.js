
import { Server } from 'socket.io';
import * as ChatServices from '../services/chat.service.js';
import * as MatchServices from '../services/match.service.js';


export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    }
  });



  io.on('connection', (socket) => {
    logger.info('New user connected');

    socket.on('joinRoom', ({ chatId }) => {
      socket.join(chatId)
      logger.info(`User joined chat ${chatId}`);
    })

    socket.on('getChats', async ({ userId }, callback) => {
      const chats = await ChatServices.getChatsByUser(userId);
      callback(chats)
    });

    socket.on('getConfirmedMatchesByUserId', async ({ userId }, callback) => {
      const matches = await MatchServices.getConfirmedMatches(userId)
      callback(matches)
    })

    socket.on('addNewChat', async({ user1Id, user2Id },callback) => {
      const chat = await ChatServices.findOrCreateChat(user1Id,user2Id)
      callback(chat)
    })

    socket.on('sendMessage', async ({ room, sender, msg }) => {
      const message = await ChatServices.createMessage(room, sender, msg)
      io.to(room).emit('messageReceived', message)
    })

    socket.on('disconnect', () => {
      logger.info('user disconnected');
    });
  });

  return io
}