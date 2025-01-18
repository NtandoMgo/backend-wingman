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

// Update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    // Transform frontend data structure to match database schema
    const profileUpdates = {
      photos: updates.photos,
      gender: updates.basicInfo?.gender,
      interest: updates.basicInfo?.interestedIn?.[0],
      starSign: updates.basicInfo?.starSign,
      
      university: updates.academic?.university,
      degree: updates.academic?.degree,
      yearOfStudy: updates.academic?.yearOfStudy,
      residence: updates.academic?.residence,
      
      shortBio: updates.bio?.shortBio,
      aboutMe: updates.bio?.longBio,
      personalityTraits: updates.bio?.personalities,
      lookingFor: updates.bio?.interests,
      
      languages: updates.languages,
      socialLinks: updates.social
    };

    // Update profile
    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: profileUpdates },
      { new: true, runValidators: true }
    ).populate('user', '-password');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Update user data if necessary
    if (updates.basicInfo) {
      const userUpdates = {
        name: updates.basicInfo.name,
        username: updates.basicInfo.username,
        email: updates.basicInfo.email
      };

      await User.findByIdAndUpdate(userId, { $set: userUpdates }, { runValidators: true });
    }

    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
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
// const getUserProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // Get the user ID from the authentication middleware

//     // Fetch user with their profile data
//     const user = await User.findById(userId).populate('profile'); // 'profile' will populate the associated profile data

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({
//       message: 'Profile fetched successfully',
//       user: {
//         id: user._id,
//         name: user.name,
//         username: user.username,
//         email: user.email,
//         profile: user.profile // Include profile data
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     res.status(500).json({
//       message: 'Error fetching profile',
//       error: error.message
//     });
//   }
// };


// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find profile with populated user data
    const profile = await Profile.findOne({ user: userId })
      .populate('user', '-password');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Transform the data to match frontend structure
    const profileData = {
      photos: profile.photos || [],
      basicInfo: {
        name: profile.user.name,
        username: profile.user.username,
        email: profile.user.email,
        gender: profile.gender || '',
        interestedIn: profile.interest ? [profile.interest] : [],
        starSign: profile.starSign || ''
      },
      academic: {
        university: profile.university || '',
        degree: profile.degree || '',
        yearOfStudy: profile.yearOfStudy || '',
        residence: profile.residence || ''
      },
      bio: {
        shortBio: profile.shortBio || '',
        longBio: profile.aboutMe || '',
        personalities: profile.personalityTraits || [],
        interests: profile.lookingFor || []
      },
      languages: profile.languages || [],
      social: profile.socialLinks || {
        instagram: '',
        linkedin: '',
        twitter: ''
      }
    };

    res.status(200).json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};


module.exports = { updateFullProfile, getOwnProfile, getUserProfile, updateProfile };
