const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Route imports
const cartRoutes = require("./routes/cart");
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const bannerRoutes = require("./routes/banners");
const favouriteRoutes = require("./routes/favourites");
const cartsRoutes = require("./routes/carts");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/favourites", favouriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/carts", cartsRoutes);
app.use("/api/products", productRoutes);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ StyleSphere backend is running!");
});

// ✅ Serve React build (keep this below all API routes)
app.use(express.static(path.join(__dirname, "../stylesphereapp/build")));

// ✅ Fallback for React Router (Express 5+ compatible)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../stylesphereapp/build", "index.html"));
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
