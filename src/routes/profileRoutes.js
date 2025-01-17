const express = require('express');
const router = express.Router();
const { updateFullProfile, getOwnProfile, getUserProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware'); // authentication middleware

// Route to update entire profile
// router.post('/update', auth, updateFullProfile);

// Route to get user profile
router.get('/profile', auth, getUserProfile);

// Route to get user's own profile
router.get('/me', auth, getOwnProfile);

module.exports = router;