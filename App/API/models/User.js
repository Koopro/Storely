const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'owner', 'user'],
    default: 'user'
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  verificationToken: { 
    type: String, 
    required: false 
  },
  profileImageUrl: {
    type: String,
    default: '/uploads/profile/default/default.png' // Adjust this path to your default image
  },
  profileImageName: { 
    type: String,
    default: 'default.png'
  },
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
