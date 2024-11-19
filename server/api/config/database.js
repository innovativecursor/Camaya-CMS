const { Sequelize } = require("sequelize");

// Initialize Sequelize with your database credentials
const sequelize = new Sequelize("Camaya", "root", "root", {
  dialect: "mysql", // or any other dialect
  host: "localhost", // or your database host
});

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
