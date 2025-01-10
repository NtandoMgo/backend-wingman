// src/routes/meetupRoutes.js
const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const Meetup = require('../models/meetup');

// Create a meetup route
router.post('/', authenticateJWT, async (req, res) => {
  const { location, dateTime, description, participants } = req.body;
  const hostId = req.user.userId;

  try {
    const newMeetup = new Meetup({
      hostId,
      location,
      dateTime,
      description,
      participants,
    });
    await newMeetup.save();
    res.status(201).json({ message: 'Meetup created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating meetup', error: err.message });
  }
});

// Get meetups route
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const meetups = await Meetup.find({ participants: req.user.userId })
      .populate('hostId', 'username')
      .populate('participants', 'username');
    res.status(200).json(meetups);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meetups', error: err.message });
  }
});

module.exports = router;  // Export the meetup routes
