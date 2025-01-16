const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^@?[\w]+$/, 'Please enter a valid username']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
    required: true
  },
  interestedIn: {
    type: String,
    enum: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
    required: true
  },

  // Academic Information
  university: {
    type: String,
    required: true,
    enum: ['University of Cape Town'] // Add more universities as needed
  },
  yearOfStudy: {
    type: String,
    required: true
  },
  degree: {
    type: String,
    required: true
  },
  residence: {
    type: String
  },

  // Photos (up to 6 items)
  photos: [{
    url: String,
    type: {
      type: String,
      enum: ['image', 'gif', 'video']
    },
    duration: Number, // for videos (in seconds)
    _id: false // Disable automatic _id for subdocuments
  }],

  // About Me
  shortBio: {
    type: String,
    maxLength: 160,
    trim: true
  },
  aboutMe: {
    type: String,
    maxLength: 1000,
    trim: true
  },

  // Multiple Selection Arrays
  personalityTraits: [{
    type: String,
    enum: [
      'Outgoing', 'Talkative', 'Reserved', 'Creative', 'Analytical',
      'Adventurous', 'Empathetic', 'Organized', 'Spontaneous', 'Ambitious',
      'Introverted', 'Extroverted', 'Friendly', 'Energetic', 'Calm',
      'Artistic', 'Athletic', 'Intellectual', 'Humorous', 'Practical'
    ]
  }],

  lookingFor: [{
    type: String,
    enum: [
      'Networking', 'Dating', 'Love', 'Friendship', 'Study Partners',
      'Mentorship', 'Coffee Buddies', 'Gym Partners', 'Project Collaborators'
    ]
  }],

  languages: [{
    type: String,
    enum: [
      'English', 'Afrikaans', 'Zulu', 'Xhosa', 'Sotho', 'Tswana',
      'Venda', 'Tsonga', 'Swati', 'Ndebele', 'French', 'Portuguese',
      'Spanish', 'Mandarin', 'Hindi'
    ]
  }],

  // Additional Information
  starSign: {
    type: String,
    enum: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ]
  },

  // Settings & Preferences
  settings: {
    activityStatus: {
      type: String,
      enum: ['Available', 'Away', 'Offline'],
      default: 'Available'
    },
    showInMeetups: {
      type: Boolean,
      default: true
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    accountStatus: {
      type: String,
      enum: ['Active', 'Deactivated'],
      default: 'Active'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Indexes for better query performance
profileSchema.index({ user: 1 });
profileSchema.index({ username: 1 });
profileSchema.index({ 'settings.accountStatus': 1 });

// Validate photos array length
profileSchema.path('photos').validate(function(photos) {
  return photos.length <= 6;
}, 'Photos cannot exceed 6 items');

// Ensure username starts with @
profileSchema.pre('save', function(next) {
  if (this.username && !this.username.startsWith('@')) {
    this.username = '@' + this.username;
  }
  next();
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;