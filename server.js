const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
// ================= MULTER CONFIG (NEW - ADD THIS) =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Now your existing routes will work (they already use upload.single("photo"))
const PORT = 3001;

const profilePicRoutes = require("./profilepic");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", profilePicRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= DATABASE FILE =================

const DB_FILE = path.join(__dirname, "db.json");
const FEEDBACK_FILE = path.join(__dirname, "feedbacks.json");

// Create db.json if not exists
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ users: [], foods: [], orders: [] }, null, 2)
    );
  }
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// ================= USERS =================

app.get("/users", (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.post("/users", (req, res) => {
  const db = readDB();
  db.users.push(req.body);
  writeDB(db);
  res.status(201).json(req.body);
});

app.patch("/users/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);

  db.users = db.users.map((user) =>
    user.id === id ? { ...user, ...req.body } : user
  );

  writeDB(db);
  res.json({ message: "User updated" });
});

// ================= FOODS =================

app.get("/foods", (req, res) => {
  const db = readDB();
  res.json(db.foods);
});

app.post("/foods", upload.single("photo"), (req, res) => {
  const db = readDB();

const newFood = {
  foodId: Date.now(),
  foodname: req.body.foodname,
  price: parseFloat(req.body.price),
  mealtypes: req.body.mealtypes ? JSON.parse(req.body.mealtypes) : [],   // ← new array
  foodtype: req.body.foodtype,
  photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
};
console.log("Received body:", req.body);
console.log("Parsed mealtypes:", req.body.mealtypes ? JSON.parse(req.body.mealtypes) : "not received");
  db.foods.push(newFood);
  writeDB(db);
  res.status(201).json(newFood);
});

app.patch("/foods/:id", upload.single("photo"), (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);

  let found = false;

  db.foods = db.foods.map((food) => {
    if (food.foodId === id) {
      found = true;

    const updatedFood = {
  ...food,
  foodname: req.body.foodname || food.foodname,
  price: req.body.price ? parseFloat(req.body.price) : food.price,
  mealtypes: req.body.mealtypes ? JSON.parse(req.body.mealtypes) : food.mealtypes || [],   // ← new
  foodtype: req.body.foodtype || food.foodtype,
};

      if (req.file) {
        // Optional: remove old photo if exists
        if (food.photoUrl) {
          const oldFilePath = path.join(__dirname, food.photoUrl);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updatedFood.photoUrl = `/uploads/${req.file.filename}`;
      }

      return updatedFood;
    }
    return food;
  });

  if (!found) {
    return res.status(404).json({ message: "Food not found" });
  }

  writeDB(db);
  res.json({ message: "Food updated successfully" });
});

app.delete("/foods/:id", (req, res) => {
  const db = readDB();
  const id = Number(req.params.id);

  const foodToDelete = db.foods.find(f => f.foodId === id);
  if (foodToDelete && foodToDelete.photoUrl) {
    const filePath = path.join(__dirname, foodToDelete.photoUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  db.foods = db.foods.filter((food) => food.foodId !== id);

  writeDB(db);
  res.json({ message: "Food deleted successfully" });
});

// ================= ORDERS =================

app.get("/orders", (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

app.post("/orders", (req, res) => {
  const db = readDB();

  const newOrder = {
    id: Date.now().toString(),
    ...req.body
  };

  db.orders.push(newOrder);
  writeDB(db);

  res.status(201).json(newOrder);
});

app.patch("/orders/:id", (req, res) => {
  const db = readDB();
  const id = req.params.id;

  let found = false;

  db.orders = db.orders.map((order) => {
    if (String(order.id) === String(id)) {
      found = true;

      if (req.body.newRoutePoint) {
        return {
          ...order,
          routeHistory: [
            ...(order.routeHistory || []),
            req.body.newRoutePoint
          ]
        };
      }

      return { ...order, ...req.body };
    }
    return order;
  });

  if (!found) {
    return res.status(404).json({ message: "Order not found" });
  }

  writeDB(db);
  res.json({ message: "Order updated successfully" });
});

app.delete("/orders/:id", (req, res) => {
  const db = readDB();
  const id = req.params.id;

  db.orders = db.orders.filter((order) => order.id !== id);
  writeDB(db);
  res.json({ message: "Order deleted" });
});

// ================= FEEDBACK =================

const readFeedbacks = () => {
  if (!fs.existsSync(FEEDBACK_FILE)) {
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify([], null, 2));
  }
  return JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf-8"));
};

const writeFeedbacks = (feedbacks) => {
  fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(feedbacks, null, 2));
};

app.get("/feedbacks", (req, res) => {
  try {
    const feedbacks = readFeedbacks();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Failed to read feedbacks" });
  }
});

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

// ================= START SERVER =================

app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}`);
});