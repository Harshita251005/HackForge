const User = require('../models/User');
const { uploadImage } = require('../utils/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('participatedEvents', 'title startDate endDate image')
      .populate({
        path: 'teams',
        populate: {
          path: 'event',
          select: 'title',
        },
      });

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, bio, skills, githubLink, linkedinLink } = req.body;

    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (skills) user.skills = skills;
    if (githubLink !== undefined) user.githubLink = githubLink;
    if (linkedinLink !== undefined) user.linkedinLink = linkedinLink;
    
    if (email && email !== user.email) {
      // Check if email already exists
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      user.email = email;
      user.isEmailVerified = false; // Require re-verification
    }

    await user.save();

    // Return full user object for frontend
    const updatedUser = await User.findById(user._id)
      .populate('participatedEvents', 'title startDate endDate image')
      .populate({
        path: 'teams',
        populate: {
          path: 'event',
          select: 'title',
        },
      });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-avatar
// @access  Private
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image provided',
      });
    }

    // Get the file path relative to the server
    // We need to construct the full URL or just the path depending on how frontend handles it
    // For now, let's store the relative path: /uploads/filename
    const imagePath = `/uploads/${req.file.filename}`;
    const fullUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}${imagePath}`;
    
    // Actually, better to store the full URL if possible, or just the path and let frontend prepend API URL
    // But since we are serving static files from backend, the URL should be BACKEND_URL/uploads/filename
    // Let's assume backend is on port 4000
    const backendUrl = process.env.VITE_API_URL ? process.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4000';
    const imageUrl = `${backendUrl}${imagePath}`;

    // Update user profile picture
    const user = await User.findById(req.user.id);
    user.profilePicture = imageUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      profilePicture: imageUrl,
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message,
    });
  }
};

// @desc    Get user's events
// @route   GET /api/users/my-events
// @access  Private
exports.getMyEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('participatedEvents');

    res.json({
      success: true,
      events: user.participatedEvents,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

// @desc    Get user's teams
// @route   GET /api/users/my-teams
// @access  Private
exports.getMyTeams = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'teams',
      populate: [
        { path: 'event', select: 'title startDate endDate' },
        { path: 'members', select: 'name email profilePicture' },
        { path: 'leader', select: 'name email' },
      ],
    });

    res.json({
      success: true,
      teams: user.teams,
    });
  } catch (error) {
    console.error('Get teams error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
      error: error.message,
    });
  }
};
