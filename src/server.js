require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sequelize = require("./config/database");

require("./models/User");
require("./models/Configuration");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const configRoutes = require("./routes/configurations");
app.use("/api/configurations", configRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CCE Backend is running" });
});

async function start() {
  // Au cas où MySQL met du temps à démarrer dans Docker
  const maxRetries = 10;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log("MySQL connected");
      break;
    } catch (error) {
      retries++;
      console.log(`Waiting for MySQL... (${retries}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  if (retries === maxRetries) {
    console.error("Unable to connect to MySQL after multiple retries");
    process.exit(1);
  }

  await sequelize.sync();
  console.log("Database synced");

  app.listen(PORT, () => {
    console.log(`CCE Backend running on http://localhost:${PORT}`);
  });
}

start();
