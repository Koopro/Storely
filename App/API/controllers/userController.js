const Friendship = require('../models/Friendship');
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const User = require("../models/User");

// Directory for profile image uploads
const uploadsDir = path.join(__dirname, "..", "uploads", "profile");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Helper function to delete files with retry logic
const deleteFileWithRetry = (filePath, maxAttempts = 3) => new Promise((resolve, reject) => {
    function attemptToDelete(attempt) {
        fs.unlink(filePath, (err) => {
            if (!err) {
                resolve();
            } else if (attempt < maxAttempts) {
                setTimeout(() => attemptToDelete(attempt + 1), 100); // retry after 100 ms
            } else {
                reject(err);
            }
        });
    }
    attemptToDelete(0);
});

exports.uploadProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded." });
    }

    const imagePath = path.join(uploadsDir, req.file.filename);
    const imageProcessing = sharp(imagePath);

    try {
        const metadata = await imageProcessing.metadata();
        const squareSize = Math.min(metadata.width, metadata.height);
        const croppedImage = imageProcessing.extract({
            left: Math.floor((metadata.width - squareSize) / 2),
            top: Math.floor((metadata.height - squareSize) / 2),
            width: squareSize,
            height: squareSize
        });

        const newFilename = `${req.userData.userId}-${Date.now()}.png`; // Force PNG format
        const outputPath = path.join(uploadsDir, newFilename);

        await croppedImage.toFile(outputPath);
        await deleteFileWithRetry(imagePath);

        const user = await User.findById(req.userData.userId);
        user.profileImageUrl = `/uploads/profile/${newFilename}`;
        user.profileImageName = req.file.originalname;
        await user.save();

        res.status(200).json({
            message: "File uploaded and processed successfully",
            filePath: user.profileImageUrl,
            fileName: user.profileImageName
        });
    } catch (error) {
        console.error("Failed to process image:", error);
        res.status(500).json({
            message: "Failed to process image",
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, lastname, username } = req.body;
        const user = await User.findById(req.userData.userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        if (name) user.name = name;
        if (lastname) user.lastname = lastname;
        if (username) user.username = username;

        if (req.file) {
            const imagePath = path.join(uploadsDir, req.file.filename);
            const imageProcessing = sharp(imagePath);
            const metadata = await imageProcessing.metadata();
            const squareSize = Math.min(metadata.width, metadata.height);
            const croppedImage = imageProcessing.extract({
                left: Math.floor((metadata.width - squareSize) / 2),
                top: Math.floor((metadata.height - squareSize) / 2),
                width: squareSize,
                height: squareSize
            });

            const newFilename = `${req.userData.userId}-${Date.now()}.png`; // Force PNG format
            const outputPath = path.join(uploadsDir, newFilename);
            await croppedImage.toFile(outputPath);
            await deleteFileWithRetry(imagePath);

            user.profileImageUrl = `/uploads/profile/${newFilename}`;
            user.profileImageName = req.file.originalname;
        }

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Failed to update profile:", error);
        res.status(500).json({ message: "Failed to update profile", error: error.toString() });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        res.status(500).json({
            message: "Failed to fetch user profile",
            error: error.toString(),
        });
    }
};

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

exports.deleteUser = async (req, res) => {
    try {
        const userIdToDelete = req.params.userId;
        const currentUserId = req.userData.userId;

        // Get current user details
        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).send('Current user not found');
        }

        // If the current user is not an admin, they can only delete their own account
        if (currentUser.role !== 'admin' && currentUserId !== userIdToDelete) {
            return res.status(403).send('Permission denied');
        }

        // Check if the user to delete exists
        const userToDelete = await User.findById(userIdToDelete);
        if (!userToDelete) {
            return res.status(404).send('User not found');
        }

        // Delete the user
        await User.findByIdAndDelete(userIdToDelete);

        // Delete all relationships involving this user
        await Friendship.deleteMany({
            $or: [{ requester: userIdToDelete }, { recipient: userIdToDelete }]
        });

        res.status(200).send('User and related relationships deleted successfully');
    } catch (error) {
        console.error('Failed to delete user:', error);
        res.status(500).send('Failed to delete user');
    }
};
