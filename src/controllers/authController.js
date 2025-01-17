const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Profile = require('../models/profile'); // Ensure Profile is imported
const jwt = require('jsonwebtoken');

// Allowed tertiary domains
const allowedDomains = [
  'myuct.ac.za', // Example domain for University of Cape Town
];

// Function to check if the email has a valid domain
const isValidEmailDomain = (email) => {
  const domain = email.split('@')[1]; // Get the domain part of the email
  return allowedDomains.includes(domain); // Check if the domain is in the allowed list
};

// Registration controller
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Ensure all required fields are provided
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Check if email is already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ name, username, email, password: hashedPassword });

    // Create an empty profile for the user
    const profile = await Profile.create({ user: newUser._id });

    // Link profile to user
    newUser.profile = profile._id;

    // Save user with the linked profile
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the user by email
    const user = await User.findOne({ email });

    // If user is not found
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    // If passwords do not match
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with success and the token
    res.status(200).json({ message: 'Login successful', token });

  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = { registerUser, loginUser };
