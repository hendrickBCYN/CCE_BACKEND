require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

require("./models/User");
require("./models/Configuration");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CCE Backend is running" });
});

async function start() {
  try {
    await sequelize.authenticate();
    console.log("MySQL connected");
    
    await sequelize.sync();
    console.log("MySQL synced");
    
    // Démarrage
    app.listen(PORT, () => {
      console.log(`CCE Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server", error);
    process.exit(1);
  }
}

start();
