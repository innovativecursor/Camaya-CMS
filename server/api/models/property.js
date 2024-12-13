const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Property = sequelize.define(
  "Property",
  {
    prop_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    station_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    pictures: { type: DataTypes.JSON, allowNull: false },
  },
  {
    hooks: {
      beforeCreate: (property) => {
        property.prop_id = uuidv4();
      },
    },
  }
);

module.exports = Property;
