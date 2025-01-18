const express = require('express');
const router = express.Router();
const { updateFullProfile, getOwnProfile, getUserProfile } = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');

router.post('/update', auth, updateFullProfile);
router.get('/me', auth, getOwnProfile);
router.get('/:userId', auth, getUserProfile);

module.exports = router;