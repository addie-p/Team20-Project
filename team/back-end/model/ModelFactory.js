// import { Sequelize } from 'sequelize';
// import RestaurantModel from './RestaurantModel.js';

const Sequelize = require('sequelize').Sequelize; // Accessing Sequelize from the module
const RestaurantModel = require('./RestaurantModel'); // Adjust path if necessary
const path = require('path');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '../scripts/database.sqlite'),
});

const models = {
    Restaurant: RestaurantModel(sequelize),
};

//export { sequelize, models };
module.exports = { sequelize, models };
