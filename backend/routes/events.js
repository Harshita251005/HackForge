const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventParticipants,
} = require('../controllers/eventController');
const { protect, requireOrganizer } = require('../middleware/auth');

router.post('/', protect, requireOrganizer, createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEvent);
router.put('/:id', protect, requireOrganizer, updateEvent);
router.delete('/:id', protect, requireOrganizer, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/unregister', protect, unregisterFromEvent);
router.get('/:id/participants', getEventParticipants);

module.exports = router;
