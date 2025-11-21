const express = require('express');
const router = express.Router();
const {
  createTeam,
  getTeams,
  getTeam,
  updateTeam,
  deleteTeam,
  joinTeam,
  leaveTeam,
  inviteToTeam,
} = require('../controllers/teamController');
const { protect, requireEmailVerification } = require('../middleware/auth');

router.get('/', getTeams);
router.post('/', protect, requireEmailVerification, createTeam);
router.get('/:id', getTeam);
router.put('/:id', protect, updateTeam);
router.delete('/:id', protect, deleteTeam);
router.post('/:id/join', protect, requireEmailVerification, joinTeam);
router.post('/:id/leave', protect, leaveTeam);
router.post('/:id/invite', protect, inviteToTeam);

module.exports = router;
