const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();


const PROFILE_DIR = path.join(__dirname, "uploads/profile");

if (!fs.existsSync(PROFILE_DIR)) {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PROFILE_DIR);
  },
  filename: (req, file, cb) => {
    const userId = req.body.userId;
    const ext = path.extname(file.originalname);
    cb(null, `user_${userId}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post("/profile-pic", upload.single("image"), (req, res) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const imageUrl = `/uploads/profile/${req.file.filename}`;

    res.json({
      message: "Profile picture uploaded successfully",
      userId,
      imageUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Profile upload failed" });
  }
});

module.exports = router;
