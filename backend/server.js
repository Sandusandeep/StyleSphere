const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// --- API routes ---
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "✅ StyleSphere backend + frontend working",
  });
});

// --- Serve React build ---
const buildPath = path.join(__dirname, "../stylesphereapp/build");
app.use(express.static(buildPath));

// Works for Express 4 and 5
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// --- Start server ---
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
