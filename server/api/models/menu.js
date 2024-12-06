const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Amenity = require("./amenities");

const Menu = sequelize.define("Menu", {
  menu_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  menu_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Menu;
