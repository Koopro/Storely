const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('./services/emailService'); 
const adminMiddleware = require('../middleware/adminMiddleware'); // Adjust path as necessary
const authMiddleware = require('../middleware/authMiddleware');

// Registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, lastname, username, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email, username });
    if (existingUser) {
        return res.status(400).send({ error: 'Email already in use' });
    }

    // Create a new user instance
    const user = new User({ email, password, name, lastname, username, role });

    // Generate a verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken; // Assign token to user

    // Save the user
    await user.save();

    console.log(`Verification token for ${user.email}: ${verificationToken}`);

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);

    // Respond without sending the token, user needs to verify email first
    res.status(201).send({ message: 'Registration successful, please verify your email.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).send(error);
  }
});

// Email Verification
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;
    console.log(`Received token: ${token}`); // Debugging log

    const user = await User.findOne({ verificationToken: token });
    console.log(`User found: ${user}`); // Debugging log

    if (!user) {
      return res.status(400).send({ error: 'Invalid token or user not found' });
    }

    user.isVerified = true;
    user.verificationToken = ''; // Clear the verification token
    await user.save();

    res.send('Email verified successfully. You can now login.');
  } catch (error) {
    console.error('Verification error:', error);
    res.status(400).send(error);
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ error: 'Login failed: User not found' });
    }
    if (!user.isVerified) {
      return res.status(401).send({ error: 'Login failed: Please verify your email first' });
    }
    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Login failed: Incorrect password' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({
      message: 'Login successful', 
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).send(error);
  }
});

module.exports = router;

router.get('/admin/data', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Fetch all users excluding their passwords
    console.log('Admin data route accessed, returning all user data');
    res.json(users); // Send the list of users as a JSON response
  } catch (error) {
    console.error('Error in admin data route:', error);
    res.status(500).send('Internal Server Error');
  }
});



module.exports = router;
