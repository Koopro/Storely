const User = require('../models/User'); // Adjust the path as necessary

const updateUserStatus = async (userId, status) => {
  console.log(`Attempting to update user ${userId} to status: ${status}`);
  try {
    const result = await User.findByIdAndUpdate(userId, { status: status }, { new: true });
    console.log(`Update result:`, result);
    return result;
  } catch (error) {
    console.error(`Error updating user ${userId} status to ${status}:`, error);
    throw error; // Rethrow the error if you want to handle it further up the chain.
  }
};

module.exports = {
  updateUserStatus,
};
