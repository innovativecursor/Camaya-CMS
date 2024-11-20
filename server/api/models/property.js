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
    prop_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    description: DataTypes.TEXT,
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
