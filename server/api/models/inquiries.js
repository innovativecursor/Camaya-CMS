const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Inquiry = sequelize.define("Inquiry", {
  inquiry_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull:false
  },
  email: {
    type: DataTypes.STRING,
    allowNull:false

  },
  mobile_number: {
    type: DataTypes.STRING,
    allowNull:false
  },
  message: {
    type: DataTypes.STRING,
  },
});
module.exports = Inquiry;
