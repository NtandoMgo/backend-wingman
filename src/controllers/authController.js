const bcrypt = require('bcryptjs');
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

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields (username, email, password) are required' });
  }

  if (!isValidEmailDomain(email)) {
    return res.status(400).json({ message: 'Email must belong to a valid tertiary institution domain.' });
  }

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  try {

    // Create a new user
    const newUser = new User({ username, email, password});

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error creating user:', err);  // Log error details
    res.status(500).json({ message: 'Error creating user', error: err.message });
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
