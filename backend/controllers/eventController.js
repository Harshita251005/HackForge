const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { uploadImage } = require('../utils/cloudinary');

// @desc    Create event
// @route   POST /api/events
// @access  Private (Organizer/Admin only)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      startDate,
      endDate,
      maxTeamSize,
      registrationDeadline,
      venue,
      prizes,
      rules,
    } = req.body;

    let imageUrl = '';
    if (image) {
      const result = await uploadImage(image, 'hackathon-platform/events');
      if (result.success) {
        imageUrl = result.url;
      }
    }

    const event = await Event.create({
      title,
      description,
      image: imageUrl,
      startDate,
      endDate,
      organizer: req.user.id,
      maxTeamSize: maxTeamSize || 4,
      registrationDeadline,
      venue,
      prizes,
      rules,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ startDate: -1 });

    res.json({
      success: true,
      count: events.length,
      events,
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

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email profilePicture')
      .populate('participants', 'name email profilePicture')
      .populate({
        path: 'teams',
        populate: {
          path: 'members leader',
          select: 'name email profilePicture',
        },
      });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer/Admin only)
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event',
      });
    }

    const {
      title,
      description,
      image,
      startDate,
      endDate,
      maxTeamSize,
      status,
      registrationDeadline,
      venue,
      prizes,
      rules,
    } = req.body;

    if (image && image !== event.image) {
      const result = await uploadImage(image, 'hackathon-platform/events');
      if (result.success) {
        event.image = result.url;
      }
    }

    if (title) event.title = title;
    if (description) event.description = description;
    if (startDate) event.startDate = startDate;
    if (endDate) event.endDate = endDate;
    if (maxTeamSize) event.maxTeamSize = maxTeamSize;
    if (status) event.status = status;
    if (registrationDeadline) event.registrationDeadline = registrationDeadline;
    if (venue) event.venue = venue;
    if (prizes) event.prizes = prizes;
    if (rules) event.rules = rules;

    await event.save();

    // Notify all participants about update
    if (event.participants.length > 0) {
      const notifications = event.participants.map(participantId => ({
        user: participantId,
        type: 'event_update',
        title: 'Event Updated',
        message: `The event "${event.title}" has been updated`,
        relatedId: event._id,
        relatedModel: 'Event',
      }));
      await Notification.insertMany(notifications);
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if already registered
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event',
      });
    }

    // Add user to participants
    event.participants.push(req.user.id);
    await event.save();

    // Add event to user's participated events
    await User.findByIdAndUpdate(req.user.id, {
      $push: { participatedEvents: event._id },
    });

    // Create notification
    await Notification.create({
      user: req.user.id,
      type: 'registration',
      title: 'Registration Successful',
      message: `You have successfully registered for ${event.title}`,
      relatedId: event._id,
      relatedModel: 'Event',
    });

    res.json({
      success: true,
      message: 'Registered for event successfully',
    });
  } catch (error) {
    console.error('Register event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message,
    });
  }
};

// @desc    Unregister from event
// @route   POST /api/events/:id/unregister
// @access  Private
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if registered
    if (!event.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Not registered for this event',
      });
    }

    // Remove user from participants
    event.participants = event.participants.filter(
      participant => participant.toString() !== req.user.id
    );
    await event.save();

    // Remove event from user's participated events
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { participatedEvents: event._id },
    });

    res.json({
      success: true,
      message: 'Unregistered from event successfully',
    });
  } catch (error) {
    console.error('Unregister event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering from event',
      error: error.message,
    });
  }
};

// @desc    Get event participants
// @route   GET /api/events/:id/participants
// @access  Public
exports.getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'participants',
      'name email profilePicture'
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.json({
      success: true,
      participants: event.participants,
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching participants',
      error: error.message,
    });
  }
};
