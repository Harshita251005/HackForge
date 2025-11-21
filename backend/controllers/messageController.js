const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, eventId, chatId, type } = req.body;

    const messageData = {
      sender: req.user.id,
      content,
      type: type || 'direct',
    };

    let socketRoom = null;

    if (chatId) {
      // Assuming chatId is teamId for now based on frontend
      messageData.teamId = chatId;
      messageData.type = 'team';
      socketRoom = `team_${chatId}`;
    } else if (type === 'event' && eventId) {
      messageData.eventId = eventId;
      socketRoom = `event_${eventId}`;
    } else if (receiverId) {
      messageData.receiver = receiverId;
      // For direct messages, we might not have a room, or we emit to specific user
    } else {
        return res.status(400).json({
          success: false,
          message: 'Receiver ID, Team ID (chatId), or Event ID is required',
        });
    }

    const message = await Message.create(messageData);

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture');

    // Socket.io - Emit to room
    const io = req.app.get('io');
    if (io) {
      if (socketRoom) {
        io.to(socketRoom).emit('newMessage', populatedMessage);
      } else if (receiverId) {
        // For direct messages, we need to find the socket ID of the receiver
        // This logic should ideally be in socketHandler or we need a way to map userId to socketId here
        // But since socketHandler maintains the map, we can emit a global event that socketHandler listens to?
        // Or better, let's just use the socketHandler logic if possible.
        // Actually, we can't easily access the `users` map from here since it's in a closure in socketHandler.js
        // A common pattern is to store userId->socketId in Redis or DB, or attach the map to `app`.
        
        // For now, let's rely on the client joining a room with their own userId
        io.to(receiverId).emit('newMessage', populatedMessage);
      }

      // Emit notification to the same room/user
      // This allows the frontend to show a notification bell update
      const notificationData = {
        type: 'message',
        title: `New message from ${req.user.name}`,
        message: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        sender: {
          _id: req.user.id,
          name: req.user.name,
          profilePicture: req.user.profilePicture
        },
        chatId: chatId || receiverId,
        teamId: chatId, // Include teamId if it exists
        createdAt: new Date()
      };

      if (socketRoom) {
        // Broadcast to room (everyone except sender ideally, but frontend handles filtering)
        io.to(socketRoom).emit('newNotification', notificationData);
      } else if (receiverId) {
        io.to(receiverId).emit('newNotification', notificationData);
      }
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message,
    });
  }
};

// @desc    Get conversation messages
// @route   GET /api/messages/:chatId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Check if it's a team chat (chatId is teamId)
    // Or direct chat (chatId is userId)
    
    // Try to find messages where teamId matches
    let messages = await Message.find({
      teamId: chatId,
      type: 'team'
    })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    // If no team messages, check for direct messages
    if (messages.length === 0) {
       messages = await Message.find({
        $or: [
          { sender: req.user.id, receiver: chatId },
          { sender: chatId, receiver: req.user.id },
        ],
        type: 'direct',
      })
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture')
        .sort({ createdAt: 1 });
    }

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversation',
      error: error.message,
    });
  }
};

// @desc    Get event messages
// @route   GET /api/messages/event/:eventId
// @access  Private
exports.getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;

    const messages = await Message.find({
      eventId,
      type: 'event',
    })
      .populate('sender', 'name profilePicture')
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Get event messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event messages',
      error: error.message,
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // Only receiver can mark as read
    if (message.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    message.isRead = true;
    await message.save();

    res.json({
      success: true,
      message: 'Message marked as read',
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking message as read',
      error: error.message,
    });
  }
};

// @desc    Get user's conversations list
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversationsList = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: req.user._id },
            { receiver: req.user._id },
          ],
          type: 'direct',
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', req.user._id] },
              '$receiver',
              '$sender',
            ],
          },
          lastMessage: { $first: '$$ROOT' },
        },
      },
    ]);

    await Message.populate(messages, {
      path: 'lastMessage.sender lastMessage.receiver',
      select: 'name email profilePicture',
    });

    res.json({
      success: true,
      conversations: messages,
    });
  } catch (error) {
    console.error('Get conversations list error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching conversations',
      error: error.message,
    });
  }
};
