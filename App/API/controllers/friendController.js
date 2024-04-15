const Friendship = require('../models/Friendship');

exports.requestFriendship = async (req, res) => {
    const { recipientId } = req.body;
    const requesterId = req.userData.userId;

    try {
        // Check for existing friendship request
        const existingFriendship = await Friendship.findOne({
            requester: requesterId,
            recipient: recipientId,
            status: { $in: ['requested', 'accepted'] }  // Check if there is already a request or an accepted friendship
        });

        if (existingFriendship) {
            return res.status(409).json({ message: 'Friend request already sent or friendship already exists.' });
        }

        const friendship = new Friendship({ requester: requesterId, recipient: recipientId });
        await friendship.save();
        res.status(201).json({ message: 'Friend request sent successfully.' });
    } catch (error) {
        res.status(500).send({ message: 'Error sending friend request.' });
    }
};


exports.acceptFriendship = async (req, res) => {
    const { friendshipId } = req.body;
    try {
        const friendship = await Friendship.findByIdAndUpdate(friendshipId, { status: 'accepted' }, { new: true });
        res.status(200).json(friendship);
    } catch (error) {
        res.status(500).send('Error accepting friend request.');
    }
};

exports.blockUser = async (req, res) => {
    const { friendshipId } = req.body;
    try {
        await Friendship.findByIdAndUpdate(friendshipId, { status: 'blocked' });
        res.status(200).send('User blocked.');
    } catch (error) {
        res.status(500).send('Error blocking user.');
    }
};

exports.listFriends = async (req, res) => {
    try {
        const friends = await Friendship.find({ $or: [{ requester: req.userData.userId }, { recipient: req.userData.userId }], status: 'accepted' }).populate('requester recipient');
        res.status(200).json(friends);
    } catch (error) {
        res.status(500).send('Error retrieving friends list.');
    }
};

exports.listPendingFriendRequests = async (req, res) => {
    try {
        const pendingRequests = await Friendship.find({
            recipient: req.userData.userId,
            status: 'requested'
        }).populate('requester');
        res.status(200).json(pendingRequests);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving pending friend requests.' });
    }
};

// Assuming you're using Express and Mongoose
exports.removeFriendship = async (req, res) => {
    const { friendshipId } = req.body;
    try {
        await Friendship.findByIdAndDelete(friendshipId)
        res.status(200).json({ message: 'Friendship removed successfully.' });
    } catch (error) {
        console.error('Error removing friendship:', error);
        res.status(500).send({ message: 'Error removing friendship.' });
    }
};



