const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registration
// Assuming you have this POST /register endpoint
router.post('/register', async (req, res) => {
    try {
      const { email, password, name, lastname, username, role } = req.body;
      const user = new User({ email, password, name, lastname, username, role });
      await user.save();
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.status(201).send({ token });
    } catch (error) {
      res.status(400).send(error);
    }
  });
  

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Login failed!' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;