const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  uploadAvatar,
  getMyEvents,
  getMyTeams,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-avatar', protect, upload.single('image'), uploadAvatar);
router.get('/my-events', protect, getMyEvents);
router.get('/my-teams', protect, getMyTeams);

module.exports = router;
