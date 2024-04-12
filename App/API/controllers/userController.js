const User = require('../models/User');
const Friendship = require('../models/Friendship');

exports.listAllUsers = async (req, res) => {
    try {
        // Get the current user's ID from auth middleware or session
        const userId = req.userData.userId;

        // Find all friendships for the current user
        const friends = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: 'accepted' // Assuming you also want to exclude pending, add it to the condition
        });

        // Extract user IDs from these friendships
        const friendIds = friends.map(friend =>
            friend.requester.toString() === userId ? friend.recipient : friend.requester
        );

        // Fetch all users except the current user and their friends
        const users = await User.find({
            _id: { $nin: [...friendIds, userId] }
        }).select('-password'); // Exclude sensitive data

        res.json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).send('Failed to retrieve users');
    }
};
