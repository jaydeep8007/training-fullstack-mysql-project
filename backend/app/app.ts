import dotenv from "dotenv";
dotenv.config();

import express from "express";
import logger from "morgan";

import bodyParser from "body-parser";
import cors from "cors"; //For cross domain error

import cookieParser from "cookie-parser";

//db connections
import sequelize from "./config/sequelize";

/* MAIN ROUTES */
import router from "./routes/main.route";

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// Middleware
// app.use(cors());
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"] }));
app.use(cookieParser()); // Parse cookies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.use(express.json());
app.use(logger("dev"));

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger("combined")); // Just uncomment this line to show logs.

/* =======   Settings for CORS ========== */
app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

function haltOnTimedout(req: any, res: any, next: any) {
  if (!req.timedout) next();
}

/* MAIN ROUTES FOR APP */
app.use("/api/v1", router);

const PORT = process.env.PORT || 3000;

// Import your models with associations
import models from "./models/index";

app.listen(PORT, async () => {
  try {
    await models.sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // Sync all models and associations
    await models.sequelize.sync({ alter: true });
    console.log("✅ Database synced successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database or sync:", error);
  }

  console.log(`🚀 App is listening on port ${PORT} for demo Node server`);
});
