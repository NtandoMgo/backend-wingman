// src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();  // Initialize router
const authenticateJWT = require('../middleware/authMiddleware');
const Message = require('../models/message');

// Send a message route
router.post('/', authenticateJWT, async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.userId;

  try {
    const newMessage = new Message({ senderId, receiverId, content });
    await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

// Get messages route
router.get('/', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .populate('senderId', 'username')
      .populate('receiverId', 'username');
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err.message });
  }
});

module.exports = router;  // Don't forget to export the router
