const User = require('../models/User');
const Friendship = require('../models/Friendship');

exports.listAllUsers = async (req, res) => {
    try {
        // Get the current user's ID from auth middleware or session
        const userId = req.userData.userId;

        // Find all relationships (friendships and pending requests) involving the current user
        const relationships = await Friendship.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: { $in: ['accepted', 'requested', 'blocked'] } // Include 'blocked' if you manage such a status
        });

        // Extract user IDs from these relationships
        const excludedIds = relationships.map(rel =>
            rel.requester.toString() === userId ? rel.recipient : rel.requester
        );
        // Add the current user's ID to the list to exclude them as well
        excludedIds.push(userId);

        // Find all users excluding those in the relationships
        const users = await User.find({
            _id: { $nin: excludedIds }
        }).select('-password'); // Exclude sensitive data such as passwords

        res.json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);
        res.status(500).send('Failed to retrieve users');
    }
};
