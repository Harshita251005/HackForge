const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['direct', 'event', 'team'],
    default: 'direct',
  },
}, {
  timestamps: true,
});

// Index for faster queries
messageSchema.index({ sender: 1, receiver: 1 });
messageSchema.index({ eventId: 1 });

module.exports = mongoose.model('Message', messageSchema);
