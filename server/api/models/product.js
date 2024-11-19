const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Product = sequelize.define(
  "Product",
  {
    prd_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    booth_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    budget: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    closed_meeting_room: DataTypes.INTEGER,
    demo_stations: DataTypes.INTEGER,
    open_discussion_area: DataTypes.INTEGER,
    bar_area: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    hanging_sign: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    led_video_wall: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    longue_area: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    product_display: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reception_counter: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    semi_closed_meeting_area: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    storage_room: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    theatre_style_demo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    touch_screen_kiosk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    showcase_Hero_section: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    showcase_portfolio_section: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    award_winning: { type: DataTypes.BOOLEAN, defaultValue: false },
    recent_work: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    key_highlights: DataTypes.TEXT,
    description: DataTypes.TEXT,
    pictures: { type: DataTypes.JSON, allowNull: false },
  },
  {
    hooks: {
      beforeCreate: (product) => {
        product.prd_id = uuidv4();
      },
    },
  }
);

module.exports = Product;
