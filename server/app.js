require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const routes = require("./api/routes");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const sequelize = require("./api/config/database");
const compression = require("compression"); // Add this line

const app = express();

app.use(compression({ level: 9 })); // Used to compress API responses

const options = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    // "https://propshopworldwide.com",
    // "https://dev.propshopworldwide.com",
    "http://admin.thepropshopworldwide.com",
    // "http://localhost:8080",
  ],
};
app.use(cors(options));
app.use(
  bodyParser.urlencoded({
    extended: false,
    parameterLimit: 100000,
    limit: "500mb",
  })
);

app.use(express.json({ limit: "500mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));
// simple route
app.use("/", routes);

// Sync models with the database
(async () => {
  try {
    await sequelize.sync({ alter: true }); // This wiforcell drop existing tables and recreate new ones
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
})();
module.exports = app;
