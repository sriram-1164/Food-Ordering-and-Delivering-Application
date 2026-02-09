const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3002;

/* =======================
   MIDDLEWARE
======================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   FILE PATH
======================= */
const FEEDBACK_FILE = path.join(__dirname, "feedbacks.json");

/* =======================
   HELPER FUNCTIONS
======================= */
const readFeedbacks = () => {
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([]));
  }
  const data = fs.readFileSync(FEEDBACK_FILE, "utf-8");
  return JSON.parse(data || "[]");
};

const writeFeedbacks = (feedbacks) => {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
};

/* =======================
   MULTER CONFIG
======================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

/* =======================
   FEEDBACK APIs
======================= */

// GET all feedbacks
app.get("/feedbacks", (req, res) => {
  try {
    const feedbacks = readFeedbacks();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to read feedbacks" });
  }
});

// POST feedback with image
app.post("/feedbacks", upload.single("image"), (req, res) => {
  try {
    const feedbacks = readFeedbacks();

    const feedback = {
      id: Date.now().toString(),
      orderId: req.body.orderId,
      userId: req.body.userId,
      username: req.body.username,
      foodname: req.body.foodname,
      feedback: req.body.feedback,
      rating: Number(req.body.rating),
      foodId: req.body.foodId,
      createdAt: req.body.createdAt || new Date().toISOString(),
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
    };

    feedbacks.push(feedback);
    writeFeedbacks(feedbacks);

    res.status(201).json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save feedback" });
  }
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`✅ Feedback server running at http://localhost:${PORT}`);
});
