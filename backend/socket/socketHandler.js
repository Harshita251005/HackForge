const Message = require('../models/Message');
const Notification = require('../models/Notification');

// Store connected users
const users = new Map();

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // User joins with their ID
    socket.on('join', (userId) => {
      users.set(userId, socket.id);
      socket.userId = userId;
      socket.join(userId); // Join a room with their own ID for direct messages
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Join a specific room (e.g., team chat)
    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Send message
    socket.on('sendMessage', async (data) => {
      try {
        const { receiverId, content, eventId, type } = data;

        // Message is already saved via API, just emit to receiver
        const receiverSocketId = users.get(receiverId);
        
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', data);
        }
      } catch (error) {
        console.error('Socket send message error:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Send notification
    socket.on('sendNotification', async (data) => {
      try {
        const { userId, notification } = data;
        const userSocketId = users.get(userId);
        
        if (userSocketId) {
          io.to(userSocketId).emit('newNotification', notification);
        }
      } catch (error) {
        console.error('Socket send notification error:', error);
      }
    });

    // Typing indicator
    socket.on('typing', (data) => {
      const { receiverId, isTyping } = data;
      const receiverSocketId = users.get(receiverId);
      
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('userTyping', {
          userId: socket.userId,
          isTyping,
        });
      }
    });

    // User disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        users.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });
};

module.exports = socketHandler;
