// import { Sequelize } from 'sequelize';
// import RestaurantModel from './RestaurantModel.js';

const Sequelize = require('sequelize').Sequelize; // Accessing Sequelize from the module
const RestaurantModel = require('./RestaurantModel'); // Adjust path if necessary

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const models = {
    Restaurant: RestaurantModel(sequelize),
};

//export { sequelize, models };
module.exports = { sequelize, models };
