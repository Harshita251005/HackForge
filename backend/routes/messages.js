const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getEventMessages,
  markAsRead,
  getConversationsList,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversationsList);
router.get('/:chatId', protect, getMessages);
router.get('/event/:eventId', protect, getEventMessages);
router.put('/:id/read', protect, markAsRead);

module.exports = router;
