const User = require('../models/user');
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
  const { username, email, password } = req.body;

  // Check if the email has a valid domain
  if (!isValidEmailDomain(email)) {
    return res.status(400).json({ message: 'Email must belong to a valid tertiary institution domain.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Login controller
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.status(200).json({ message: 'Login successful', token });
};

module.exports = { registerUser, loginUser };
