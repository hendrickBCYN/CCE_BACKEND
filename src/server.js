require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CCE Backend is running" });
});

// Démarrage
app.listen(PORT, () => {
  console.log(`CCE Backend running on http://localhost:${PORT}`);
});