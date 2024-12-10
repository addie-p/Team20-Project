// import required models
const Sequelize = require("sequelize").Sequelize;
const RestaurantModel = require("./RestaurantModel");
const LikedRestaurantModel = require("./LikedRestaurantModel");
const VisitedRestaurantModel = require("./VisitedRestaurantModel");
const path = require("path");

// initialize w/ sqlite db configuration
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../scripts/database.sqlite"),
});

// define models to use in routes
const models = {
  Restaurant: RestaurantModel(sequelize),
  LikedRestaurant: LikedRestaurantModel(sequelize),
  VisitedRestaurant: VisitedRestaurantModel(sequelize),
};

module.exports = { sequelize, models };
