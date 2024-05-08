const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

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

// Multer storage settings
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: async (req, file, cb) => {
        const user = await User.findById(req.userData.userId);
        const fileExtension = path.extname(file.originalname);
        const newFilename = `${user._id}-${Date.now()}${fileExtension}`;
        cb(null, newFilename);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) =>
        cb(null, /\.(jpg|jpeg|png|gif)$/i.test(file.originalname)),
});

const router = express.Router();

router.post(
    "/uploadProfileImage",
    authMiddleware,
    upload.single("profileImage"),
    async (req, res) => {
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
    }
);

router.post(
    "/updateProfile",
    authMiddleware,
    upload.single("profileImage"),
    async (req, res) => {
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
    }
);

router.get("/user/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userData.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Failed to fetch user profile:", error);
        res
            .status(500)
            .json({
                message: "Failed to fetch user profile",
                error: error.toString(),
            });
    }
});

module.exports = router;
