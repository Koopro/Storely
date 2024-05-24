const express = require("express");
const multer = require("multer");
const path = require("path");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const {
    deleteUser,
    uploadProfileImage,
    updateProfile,
    getUserProfile
} = require("../controllers/userController");

// Directory for profile image uploads
const uploadsDir = path.join(__dirname, "..", "uploads", "profile");

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
    uploadProfileImage
);

router.post(
    "/updateProfile",
    authMiddleware,
    upload.single("profileImage"),
    updateProfile
);

router.get("/user/profile", authMiddleware, getUserProfile);

router.delete("/user/:userId", authMiddleware, deleteUser);

module.exports = router;
