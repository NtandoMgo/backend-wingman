const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

//  verification endpoint
router.get('/verify', auth, async (req, res) => {
    try {
      // If the middleware passes (token is valid), send success response
      res.json({
        valid: true,
        user: {
          id: req.user.id,
          // Add any other user data you want to send
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying token' });
    }
  });

module.exports = router;
