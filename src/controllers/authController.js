const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Profile = require('../models/profile');
const jwt = require('jsonwebtoken');

const allowedDomains = [
  'myuct.ac.za',
];

const isValidEmailDomain = (email) => {
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain);
};

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Validation checks
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidEmailDomain(email)) {
      return res.status(400).json({ message: 'Email domain is not allowed' });
    }

    // Check existing user/email
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username is already taken' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
    }

    // Create user and profile in a transaction
    const session = await User.startSession();
    try {
      await session.startTransaction();

      // Hash password
      //const hashedPassword = await bcrypt.hash(password, 10);

      // Create user first
      const newUser = await User.create([{
        name,
        username,
        email,
        password
      }], { session });

      // Create profile with the username
      const profile = await Profile.create([{
        user: newUser[0]._id,
        username: username  // Explicitly set the username
      }], { session });

      // Link profile to user
      newUser[0].profile = profile[0]._id;
      await newUser[0].save({ session });

      await session.commitTransaction();
      res.status(201).json({ 
        message: 'User registered successfully', 
        userId: newUser[0]._id 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: err.message 
    });
  }
};

module.exports = { registerUser, loginUser };