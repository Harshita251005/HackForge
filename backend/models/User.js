const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: [{
    type: String,
  }],
  githubLink: {
    type: String,
    default: '',
  },
  linkedinLink: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['participant', 'organizer'],
    default: 'participant',
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
  emailVerificationToken: {
    type: String,
    select: false,
  },
  resetPasswordToken: {
    type: String,
    select: false,
  },
  resetPasswordExpire: {
    type: Date,
    select: false,
  },
  participatedEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
