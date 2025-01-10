const mongoose = require('mongoose');

// Meetup schema definition
const meetupSchema = new mongoose.Schema({
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  dateTime: { type: Date, required: true },
  description: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Meetup', meetupSchema);
