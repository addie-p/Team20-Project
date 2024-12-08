// import { Sequelize } from 'sequelize';
// import RestaurantModel from './RestaurantModel.js';

const Sequelize = require("sequelize").Sequelize;
const RestaurantModel = require("./RestaurantModel");
const LikedRestaurantModel = require("./LikedRestaurantModel");
const VisitedRestaurantModel = require("./VisitedRestaurantModel");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../scripts/database.sqlite"),
});

const models = {
  Restaurant: RestaurantModel(sequelize),
  LikedRestaurant: LikedRestaurantModel(sequelize),
  VisitedRestaurant: VisitedRestaurantModel(sequelize),
};

//export { sequelize, models };
module.exports = { sequelize, models };
