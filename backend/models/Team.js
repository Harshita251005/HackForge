const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  maxMembers: {
    type: Number,
    default: 4,
  },
}, {
  timestamps: true,
});

// Ensure leader is in members array
teamSchema.pre('save', function(next) {
  if (!this.members.includes(this.leader)) {
    this.members.push(this.leader);
  }
  next();
});

module.exports = mongoose.model('Team', teamSchema);
