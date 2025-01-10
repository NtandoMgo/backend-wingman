const express = require('express');
const authenticateJWT = require('../middleware/authMiddleware');
const User = require('../models/user');
const router = express.Router();

// Get user profile
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Update user profile
router.put('/', authenticateJWT, async (req, res) => {
  const { username, bio, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, bio, location },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
