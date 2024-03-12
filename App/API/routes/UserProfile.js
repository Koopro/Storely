const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Directory for profile image uploads
const uploadsDir = path.join(__dirname, "..", "uploads", "profile");
const defaultImage = "/uploads/profile/default/default.png"; // Path to your default image

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

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
      return res.status(400).json({ message: "Please upload a file." });
    }

    try {
      const user = await User.findById(req.userData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // If user has an old image that's not the default, remove it
      if (user.profileImageUrl && user.profileImageUrl !== defaultImage) {
        const oldImagePath = path.join(
          uploadsDir,
          path.basename(user.profileImageUrl)
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath); // Use sync version for simplicity
        }
      }

      // Construct a unique filename using user ID and timestamp
      const newFilename = `${req.userData.userId}-${Date.now()}${path.extname(
        req.file.originalname
      )}`;
      const filePath = `/uploads/profile/${newFilename}`;

      user.profileImageUrl = filePath;
      user.profileImageName = req.file.originalname;

      await user.save();

      res.status(200).json({
        message: "File uploaded successfully",
        filePath: user.profileImageUrl,
        fileName: user.profileImageName,
      });
    } catch (error) {
      console.error("Failed to update user profile image:", error);
      res
        .status(500)
        .json({
          message: "Failed to update user profile image",
          error: error.message,
        });
    }
  }
);

// Fetch user profile endpoint
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

// Update profile endpoint
router.post(
  "/updateProfile",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { name, lastname } = req.body;
      const user = await User.findById(req.userData.userId);
      if (!user) return res.status(404).json({ message: "User not found." });

      // Update fields
      if (name) user.name = name;
      if (lastname) user.lastname = lastname;

      // Update image if provided
      if (req.file) {
        // Remove old image
        if (user.profileImageUrl) {
          const oldImagePath = path.join(
            uploadsDir,
            path.basename(user.profileImageUrl)
          );
          fs.unlink(oldImagePath, (err) => {
            if (err) console.log("Error removing old image:", err);
          });
        }
        user.profileImageUrl = `/uploads/profile/${req.file.filename}`;
        user.profileImageName = req.file.originalname;
      }

      await user.save();
      res.json({ message: "Profile updated successfully", user });
    } catch (error) {
      console.error("Failed to update profile:", error);
      res
        .status(500)
        .json({ message: "Failed to update profile", error: error.toString() });
    }
  }
);

module.exports = router;
