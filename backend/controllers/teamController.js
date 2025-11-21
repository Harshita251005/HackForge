const Team = require('../models/Team');
const User = require('../models/User');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { sendTeamInviteEmail } = require('../utils/emailService');

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('leader', 'name email profilePicture')
      .populate('members', 'name email profilePicture')
      .populate('event', 'title startDate endDate')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: teams.length,
      teams,
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

// @desc    Create team
// @route   POST /api/teams
// @access  Private (Email verified)
exports.createTeam = async (req, res) => {
  try {
    const { name, eventId, maxMembers } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Create team
    const team = await Team.create({
      name,
      leader: req.user.id,
      members: [req.user.id],
      event: eventId,
      maxMembers: maxMembers || event.maxTeamSize,
    });

    // Add team to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { teams: team._id },
    });

    // Add team to event
    await Event.findByIdAndUpdate(eventId, {
      $push: { teams: team._id },
    });

    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profilePicture')
      .populate('members', 'name email profilePicture')
      .populate('event', 'title');

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      team: populatedTeam,
    });
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating team',
      error: error.message,
    });
  }
};

// @desc    Get team details
// @route   GET /api/teams/:id
// @access  Public
exports.getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id)
      .populate('leader', 'name email profilePicture')
      .populate('members', 'name email profilePicture')
      .populate('event', 'title startDate endDate');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.json({
      success: true,
      team,
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
      error: error.message,
    });
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private (Team leader only)
exports.updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can update the team',
      });
    }

    const { name, maxMembers } = req.body;
    if (name) team.name = name;
    if (maxMembers) team.maxMembers = maxMembers;

    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profilePicture')
      .populate('members', 'name email profilePicture')
      .populate('event', 'title');

    res.json({
      success: true,
      message: 'Team updated successfully',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating team',
      error: error.message,
    });
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private (Team leader only)
exports.deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can delete the team',
      });
    }

    // Remove team from all members
    await User.updateMany(
      { _id: { $in: team.members } },
      { $pull: { teams: team._id } }
    );

    // Remove team from event
    await Event.findByIdAndUpdate(team.event, {
      $pull: { teams: team._id },
    });

    await team.deleteOne();

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    console.error('Delete team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting team',
      error: error.message,
    });
  }
};

// @desc    Join team
// @route   POST /api/teams/:id/join
// @access  Private (Email verified)
exports.joinTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('event', 'title');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if already a member
    if (team.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are already a member of this team',
      });
    }

    // Check if team is full
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Team is full',
      });
    }

    // Add user to team
    team.members.push(req.user.id);
    await team.save();

    // Add team to user
    await User.findByIdAndUpdate(req.user.id, {
      $push: { teams: team._id },
    });

    // Create notification for team leader
    await Notification.create({
      user: team.leader,
      type: 'team_join',
      title: 'New Team Member',
      message: `${req.user.name} joined your team ${team.name}`,
      relatedId: team._id,
      relatedModel: 'Team',
    });

    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email profilePicture')
      .populate('members', 'name email profilePicture')
      .populate('event', 'title');

    res.json({
      success: true,
      message: 'Joined team successfully',
      team: updatedTeam,
    });
  } catch (error) {
    console.error('Join team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error joining team',
      error: error.message,
    });
  }
};

// @desc    Leave team
// @route   POST /api/teams/:id/leave
// @access  Private
exports.leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if user is a member
    if (!team.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You are not a member of this team',
      });
    }

    // Leader cannot leave (must delete team instead)
    if (team.leader.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Team leader cannot leave. Please delete the team or transfer leadership.',
      });
    }

    // Remove user from team
    team.members = team.members.filter(member => member.toString() !== req.user.id);
    await team.save();

    // Remove team from user
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { teams: team._id },
    });

    res.json({
      success: true,
      message: 'Left team successfully',
    });
  } catch (error) {
    console.error('Leave team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error leaving team',
      error: error.message,
    });
  }
};

// @desc    Invite user to team
// @route   POST /api/teams/:id/invite
// @access  Private (Team leader only)
exports.inviteToTeam = async (req, res) => {
  try {
    const { email } = req.body;
    const team = await Team.findById(req.params.id).populate('event', 'title');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    // Check if user is team leader
    if (team.leader.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can invite members',
      });
    }

    // Find user by email
    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Check if already a member
    if (team.members.includes(invitedUser._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this team',
      });
    }

    // Create notification
    await Notification.create({
      user: invitedUser._id,
      type: 'team_invite',
      title: 'Team Invitation',
      message: `${req.user.name} invited you to join team ${team.name} for ${team.event.title}`,
      relatedId: team._id,
      relatedModel: 'Team',
    });

    // Send email
    await sendTeamInviteEmail(email, team.name, req.user.name, team.event.title);

    res.json({
      success: true,
      message: 'Invitation sent successfully',
    });
  } catch (error) {
    console.error('Invite to team error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending invitation',
      error: error.message,
    });
  }
};
