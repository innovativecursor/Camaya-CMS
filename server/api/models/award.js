const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Award = sequelize.define(
  "Award",
  {
    award_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    award_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    award_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    award_desc: {
      type: DataTypes.STRING,
    },
    award_pictures: { type: DataTypes.JSON, allowNull: false },
  },
  {
    hooks: {
      beforeCreate: (award) => {
        award.award_id = uuidv4();
      },
    },
  }
);
module.exports = Award;
