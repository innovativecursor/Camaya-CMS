const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Menu = require("./menu");

const Amenity = sequelize.define("Amenity", {
  amenity_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amenity_name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  amenity_desc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  pictures: { type: DataTypes.JSON, allowNull: false },
  menu_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Menu,
      key: "menu_id",
    },
  },
});
Menu.hasMany(Amenity, { foreignKey: "menu_id" });
Amenity.belongsTo(Menu, { foreignKey: "menu_id" });
module.exports = Amenity;
