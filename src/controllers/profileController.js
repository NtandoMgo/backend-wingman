const Profile = require('../models/profile');

// Create or update entire profile
const updateFullProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const profileData = {
      user: userId,
      // Basic Information
      name: req.body.name,
      username: req.body.username,
      gender: req.body.gender,
      interestedIn: req.body.interestedIn,

      // Academic Information
      university: req.body.university,
      yearOfStudy: req.body.yearOfStudy,
      degree: req.body.degree,
      residence: req.body.residence,

      // About Me
      shortBio: req.body.shortBio,
      aboutMe: req.body.aboutMe,
      
      // Multiple Selection Fields
      personalityTraits: req.body.personalityTraits,
      lookingFor: req.body.lookingFor,
      languages: req.body.languages,
      
      // Additional Information
      starSign: req.body.starSign,
      
      // Settings & Preferences
      settings: {
        activityStatus: req.body.settings?.activityStatus || 'Available',
        showInMeetups: req.body.settings?.showInMeetups ?? true,
        darkMode: req.body.settings?.darkMode ?? false,
        accountStatus: 'Active'
      }
    };

    // If photos are included in the request
    if (req.body.photos) {
      profileData.photos = req.body.photos;
    }

    // Find and update profile, create if doesn't exist
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      profileData,
      { 
        new: true, // Return updated document
        upsert: true, // Create if doesn't exist
        runValidators: true // Run schema validations
      }
    );

    res.status(200).json({
      message: 'Profile updated successfully',
      profile
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle specific errors
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({
        message: 'Username already taken',
        error: error.message
      });
    }

    res.status(500).json({
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Get user's own profile
const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ 
        message: 'Profile not found',
        exists: false
      });
    }

    res.status(200).json({
      exists: true,
      profile
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

module.exports = {
  updateFullProfile,
  getOwnProfile
};