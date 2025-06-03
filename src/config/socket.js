import { Server } from 'socket.io';
import * as ChatServices from '../services/chat.service.js';
import * as MatchServices from '../services/match.service.js';
import * as TripServices from '../services/trip.service.js';
import cron from 'node-cron';

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true
    }
  });


  const onlineUsers = new Map();

  cron.schedule('00 09 * * *', async () => {
    try {
      const groupChats = await ChatServices.getGroupChats();
      for (const g of groupChats) {
        try {
          const suggestion = await TripServices.getTripSuggestion(g.tripId);
          const distKm = (suggestion.dist / 1000).toFixed(1);
          const msg = {
            content: `How about visiting ${suggestion.name} today? It's a great spot to explore! It's about ${distKm} km away from you.`
          }
          const message = await ChatServices.createMessage(g._id, null, msg)
          io.to(g._id.toString()).emit('messageReceived', message)
        } catch (err) {
          continue;
        }
      }
    } catch (error) {
      console.error('[getTripSuggestions] Error:', err);
      throw error
    }
  }, {
    timezone: 'Asia/Jerusalem'
  });

  io.on('connection', (socket) => {
    socket.on('setup', (userId) => {
      try {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} connected with socket ${socket.id}`);
      } catch (err) {
        console.error('Error in setup:', err);
      }
    });

    socket.on('joinRoom', ({ chatId }) => {
      try {
        socket.join(chatId)
        console.log(`User joined chat ${chatId}`);
      } catch (err) {
        console.error('Error in joinRoom:', err);
      }
    })

    socket.on('getChats', async ({ userId }, callback) => {
      try {
        const chats = await ChatServices.getChatsByUser(userId);
        callback(chats)
      } catch (err) {
        console.error('Error in getChats:', err);
        callback([]);
      }
    });

    socket.on('getConfirmedMatchesByUserId', async ({ userId }, callback) => {
      try {
        const matches = await MatchServices.getConfirmedMatches(userId)
        callback(matches)
      } catch (err) {
        console.error('Error in getConfirmedMatchesByUserId:', err);
        callback([]);
      }
    })

    socket.on('addNewChat', async ({ user1Id, user2Id }) => {
      try {
        const chat = await ChatServices.findOrCreateChat(user1Id, user2Id);
        [user1Id, user2Id].forEach(async (userId) => {
          try {
            const socketId = onlineUsers.get(userId.toString());
            if (socketId) {
              const chats = await ChatServices.getChatsByUser(userId)
              io.to(socketId).emit('newChatCreated', { chats });
            }
          } catch (err) {
            console.error('Error in addNewChat (inner):', err);
          }
        });
      } catch (err) {
        console.error('Error in addNewChat:', err);
      }
    })

    socket.on('sendMessage', async ({ room, sender, msg }) => {
      try {
        const message = await ChatServices.createMessage(room, sender, msg)
        const chat = await ChatServices.getChat(room)
        await ChatServices.updateLastMessage(room, msg.content)

        chat.participants.forEach((p) => {
          try {
            const socketId = onlineUsers.get(p._id.toString());
            if (socketId) {
              io.sockets.sockets.get(socketId)?.join(room);
            }
          } catch (err) {
            console.error('Error in sendMessage (inner):', err);
          }
        });

        io.to(room).emit('messageReceived', message)
      } catch (err) {
        console.error('Error in sendMessage:', err);
      }
    })

    socket.on('createTrip', async ({ newTrip }, callback) => {
      try {
        const { participants, chatName } = newTrip
        const trip = await TripServices.createTrip(newTrip)
        const chat = await ChatServices.createGroupChat(participants, chatName, trip._id)

        participants.forEach(async (p) => {
          try {
            const socketId = onlineUsers.get(p._id.toString());
            const chats = await ChatServices.getChatsByUser(p._id)
            if (socketId) {
              io.to(socketId).emit('newTripCreated', { chats });
            }
          } catch (err) {
            console.error('Error in createTrip (inner):', err);
          }
        });
        callback({ chat })
      } catch (err) {
        console.error('Error in createTrip:', err);
        callback({ chat: null });
      }
    })

    socket.on('getTrip', async ({ tripId }, callback) => {
      try {
        const trip = await TripServices.getTrip(tripId);
        callback(trip);
      } catch (err) {
        console.error('Error in getTrip:', err);
        callback(null);
      }
    });

    socket.on('blockUser', async ({ chatId, user1Id, user2Id }) => {
      try {
        const chat = await ChatServices.archiveChat(chatId)
        await MatchServices.blockMatch(user1Id, user2Id)
        const socketId = onlineUsers.get(user2Id.toString());
        if (socketId) {
          io.to(socketId).emit('gotBlocked', { userId: user1Id, chat });
        }
      } catch (err) {
        console.error('Error in blockUser:', err);
      }
    })

    socket.on('leaveTrip', async ({ tripId, chatId, userId }) => {
      try {
        await ChatServices.deleteUserFromGroup(chatId, userId)
        await TripServices.unactiveUserFromTrip(tripId, userId)
      } catch (err) {
        console.error('Error in leaveTrip:', err);
      }
    })

    socket.on('disconnect', () => {
      try {
        for (const [userId, socketId] of onlineUsers.entries()) {
          if (socketId === socket.id) {
            onlineUsers.delete(userId);
            console.log(`User ${userId} disconnected and removed from onlineUsers`);
            break;
          }
        }
      } catch (err) {
        console.error('Error in disconnect:', err);
      }
    });
  });

  return io
}