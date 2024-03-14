const User = require('../models/User'); // Adjust the path as necessary

const adminMiddleware = async (req, res, next) => {
  try {
    // Use req.userData.userId instead of req.user.id based on authMiddleware setup
    const user = await User.findById(req.userData.userId);
    console.log('User ID from authMiddleware:', req.userData.userId);
    console.log('User found:', user);

    if (!user) {
      return res.status(404).send('User not found.');
    }
    console.log('User role:', user.role);

    if (user.role !== 'admin') {
      return res.status(403).send('Access denied. Admins only.');
    }

    next();
  } catch (error) {
    console.error('Admin Middleware Error:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = adminMiddleware;
