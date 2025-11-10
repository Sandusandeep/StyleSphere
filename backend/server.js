const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------
// ✅ API ROUTES GO HERE
// ----------------------
app.get("/api/health", (req, res) => {
  res.json({ message: "✅ Backend and API working fine!" });
});

// ----------------------
// ✅ SERVE REACT BUILD
// ----------------------
const buildPath = path.join(__dirname, "../stylesphereapp/build");
app.use(express.static(buildPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ----------------------
// ✅ SERVER STARTUP
// ----------------------
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
