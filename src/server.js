require('dotenv').config();  // Import dotenv to use environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');  // Optional, if you need CORS for frontend
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const messageRoutes = require('./routes/messageRoutes');
const meetupRoutes = require('./routes/meetupRoutes');

const app = express();

// Middleware
app.use(express.json());  // For parsing JSON requests
app.use(cors());  // Enable CORS if required

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/meetups', meetupRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
