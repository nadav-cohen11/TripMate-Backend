
import { Server } from 'socket.io';
import * as ChatServices from '../services/chat.service.js';
import * as MatchServices from '../services/match.service.js';
import * as TripServices from '../services/trip.service.js';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    }
  });

  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('setup', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ${socket.id}`);
    });

    socket.on('joinRoom', ({ chatId }) => {
      socket.join(chatId)
      console.log(`User joined chat ${chatId}`);
    })

    socket.on('getChats', async ({ userId }, callback) => {
      const chats = await ChatServices.getChatsByUser(userId);
      callback(chats)
    });

    socket.on('getConfirmedMatchesByUserId', async ({ userId }, callback) => {
      const matches = await MatchServices.getConfirmedMatches(userId)
      callback(matches)
    })

    socket.on('addNewChat', async ({ user1Id, user2Id }) => {
      const chat = await ChatServices.findOrCreateChat(user1Id, user2Id);
      [user1Id, user2Id].forEach(async (userId) => {
        const socketId = onlineUsers.get(userId.toString());
        if (socketId) {
          const chats = await ChatServices.getChatsByUser(userId)
          io.to(socketId).emit('newChatCreated', { chats });
        }
      });
    })

    socket.on('sendMessage', async ({ room, sender, msg }) => {
      const message = await ChatServices.createMessage(room, sender, msg)
      const chat = await ChatServices.getChat(room)
      await ChatServices.updateLastMessage(room, msg.content)

      chat.participants.forEach((p) => {
        const socketId = onlineUsers.get(p._id.toString());
        if (socketId) {
          io.sockets.sockets.get(socketId)?.join(room);
        }
      });

      io.to(room).emit('messageReceived', message)
    })

    socket.on('createTrip', async ({ newTrip }, callback) => {
      const { participants, chatName } = newTrip
      const trip = await TripServices.createTrip(newTrip)
      const chat = await ChatServices.createGroupChat(participants, chatName, trip._id)

      participants.forEach(async (p) => {
        const socketId = onlineUsers.get(p._id.toString());
        const chats = await ChatServices.getChatsByUser(p._id)
        if (socketId) {
          io.to(socketId).emit('newTripCreated', { chats });
        }
      });
      callback({ chat })
    })


    socket.on('getTrip', async ({ tripId }, callback) => {
      const trip = await TripServices.getTrip(tripId);
      callback(trip);
    });

    socket.on('blockUser', async ({ chatId, user1Id, user2Id }) => {
      const chat = await ChatServices.archiveChat(chatId)
      await MatchServices.blockMatch(user1Id, user2Id)
      const socketId = onlineUsers.get(user2Id.toString());
      if (socketId) {
        io.to(socketId).emit('gotBlocked', { userId: user1Id, chat });
      }
    })

    socket.on('leaveTrip', async ({ tripId, chatId, userId }) => {
      await ChatServices.deleteUserFromGroup(chatId, userId)
      await TripServices.unactiveUserFromTrip(tripId, userId)
    })

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  return io
}