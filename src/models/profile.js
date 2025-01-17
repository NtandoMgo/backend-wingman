const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Linked User ID
  
  // Photos (Max 6)
  photos: { 
    type: [String], 
    validate: [arrayLimit, 'You can upload up to 6 photos only.'] 
  },

  // Basic Information
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  interest: { type: String, enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'] },

  // Academic Information
  university: { type: String },
  yearOfStudy: { type: Number, min: 1, max: 10 },
  degree: { type: String },
  residence: { type: String },

  // About Me Section
  shortBio: { type: String, maxlength: 150 },
  aboutMe: { type: String, maxlength: 1000 },
  
  personalityTraits: [{
    type: String, 
    enum: ['Outgoing', 'Talkative', 'Reserved', 'Creative',
      'Analytical', 'Adventurous', 'Empathetic',
      'Organized', 'Spontaneous', 'Ambitious',
      'Introverted', 'Extroverted', 'Friendly',
      'Energetic', 'Calm', 'Artistic',
      'Athletic', 'Intellectual', 'Humorous', 'Practical']
  }],

  lookingFor: [{
    type: String, 
    enum: ['Networking', 'Dating', 'Love', 'Friendship',
      'Study Partners', 'Mentorship', 'Coffee Buddies',
      'Gym Partners', 'Project Collaborators']
  }],

  // Additional Information
  languages: [{ type: String }],
  starSign: { 
    type: String, 
    enum: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
           'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'], 
  },

  // Social Media (Optional)
  socialLinks: {
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
  },

  createdAt: { type: Date, default: Date.now },
});

// Function to limit photo uploads to 6
function arrayLimit(val) {
  return val.length <= 6;
}

module.exports = mongoose.model('Profile', profileSchema);
