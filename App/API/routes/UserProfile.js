const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('../models/User'); // Adjust the path as necessary
const authMiddleware = require('../middleware/authMiddleware'); // Ensure this middleware is correctly implemented

// Define the directory for profile image uploads
const uploadsDir = path.join(__dirname, '..', 'uploads', 'profile');


// Create the directory if it does not exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer's storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Initialize Multer with the defined storage settings
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

const router = express.Router();

// Endpoint to upload profile image
router.post('/uploadProfileImage', authMiddleware, upload.single('profileImage'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file.' });
    }
  
    try {
      const user = await User.findById(req.userData.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Assuming your server is set up to serve static files from 'uploadsDir'
      // Construct the file path or URL to be saved
      const filePath = `/uploads/profile/${req.file.filename}`; // Adjust as necessary
  
      // Update user document with image path and name
      user.profileImageUrl = filePath; // Save the file path
      user.profileImageName = req.file.originalname; // Optionally save the file name
  
      await user.save(); // Save changes to the user document
  
      res.status(200).json({
        message: 'File uploaded successfully',
        filePath: user.profileImageUrl, // Return the saved path
        fileName: user.profileImageName, // Optionally return the saved file name
      });
    } catch (error) {
      console.error('Failed to update user profile image:', error);
      res.status(500).json({ message: 'Failed to update user profile image', error: error.message });
    }
  });

  router.get('/user/profile', authMiddleware, async (req, res) => {
    try {
      // Assuming `req.userData.userId` is set by your `authMiddleware`
      const user = await User.findById(req.userData.userId).select('-password'); // Exclude the password from the result
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user); // Send user information back to client
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
    }
  });
  
  
  

module.exports = router;
