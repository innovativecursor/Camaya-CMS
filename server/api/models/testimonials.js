const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Testimonial = sequelize.define("Testimonial", {
  testimonial_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reviewer_name: {
    type: DataTypes.STRING,
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pictures: { type: DataTypes.JSON, allowNull: true },
});
module.exports = Testimonial;
