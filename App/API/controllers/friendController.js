const Friendship = require('../models/Friendship');

exports.requestFriendship = async (req, res) => {
    const { recipientId } = req.body;
    const requesterId = req.userData.userId;

    try {
        const existingFriendship = await Friendship.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId }
            ],
            status: { $in: ['requested', 'accepted', 'blocked'] }
        });

        if (existingFriendship) {
            return sendResponse(res, 409, null, 'Friendship or request already exists.');
        }

        const friendship = new Friendship({ requester: requesterId, recipient: recipientId, status: 'requested' });
        await friendship.save();
        sendResponse(res, 201, null, 'Friend request sent successfully.');
    } catch (error) {
        handleError(res, error, 'Error sending friend request.');
    }
};



exports.acceptFriendship = async (req, res) => {
    const { friendshipId } = req.body;

    try {
        const friendship = await Friendship.findOneAndUpdate(
            { _id: friendshipId, recipient: req.userData.userId, status: 'requested' },
            { status: 'accepted' },
            { new: true }
        );

        if (!friendship) {
            return sendResponse(res, 404, null, 'Friend request not found.');
        }

        sendResponse(res, 200, friendship, 'Friend request accepted.');
    } catch (error) {
        handleError(res, error, 'Error accepting friend request.');
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
    const userId = req.userData.userId;
    console.log("Querying pending friend requests for User ID:", userId);

    try {
        const pendingRequests = await Friendship.find({
            recipient: userId,
            status: 'requested'
        }).populate('requester');

        console.log("Found requests:", pendingRequests);
        res.status(200).json({ message: 'Pending friend requests retrieved.', data: pendingRequests });
    } catch (error) {
        console.error("Error retrieving pending friend requests:", error);
        res.status(500).send({ message: 'Error retrieving pending friend requests.' });
    }
};

exports.listSentFriendRequests = async (req, res) => {
    try {
        const sentRequests = await Friendship.find({
            requester: req.userData.userId,
            status: 'requested'
        }).populate('recipient'); // Notice we are populating recipient here since the user is the requester
        res.status(200).json({ message: 'Sent friend requests retrieved.', data: sentRequests });
        console.log("Found requests:", sentRequests);

    } catch (error) {
        res.status(500).send({ message: 'Error retrieving sent friend requests.' });
    }
};



exports.blockUser = async (req, res) => {
    const { friendshipId } = req.body;
    try {
        const result = await Friendship.findByIdAndUpdate(friendshipId, { status: 'blocked' }, { new: true });
        if (!result) {
            return sendResponse(res, 404, null, 'Friendship not found.');
        }
        sendResponse(res, 200, null, 'User blocked.');
    } catch (error) {
        handleError(res, error, 'Error blocking user.');
    }
};

exports.removeFriendship = async (req, res) => {
    const { friendshipId } = req.body;
    try {
        const result = await Friendship.findByIdAndDelete(friendshipId);
        if (!result) {
            return sendResponse(res, 404, null, 'Friendship not found.');
        }
        sendResponse(res, 200, null, 'Friendship removed successfully.');
    } catch (error) {
        handleError(res, error, 'Error removing friendship.');
    }
};


function sendResponse(res, status, data, message) {
    res.status(status).json({ status, message, data });
}
function handleError(res, error, message='An error occurred') {
    console.error(message, error);
    sendResponse(res, 500, null, message);
}




