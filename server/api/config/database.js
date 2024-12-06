const { Sequelize } = require("sequelize");

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize(
  "camaya",
  "root",
  process.env.NODE_ENV == "development" ? "root" : "theWeekend@4166",
  {
    dialect: "mysql", // or any other dialect
    host: "localhost", // or your database host
  }
);
// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
