const User = require('../models/user');
const Profile = require('../models/profile');

// Update user profile
const updateFullProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Auth middleware extracts user ID
    const updateData = { ...req.body }; // Copy request body

    // Ensure username is not duplicated
    if (updateData.username) {
      const existingUser = await User.findOne({ username: updateData.username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username already taken' });
      }
    }

    // Update user data
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password from response

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Get user profile
const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'Profile not found', exists: false });
    }

    res.status(200).json({
      exists: true,
      user
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Get user profile by user ID
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Get the user ID from the authentication middleware

    // Fetch user with their profile data
    const user = await User.findById(userId).populate('profile'); // 'profile' will populate the associated profile data

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile fetched successfully',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profile: user.profile // Include profile data
      }
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

module.exports = { updateFullProfile, getOwnProfile, getUserProfile };
