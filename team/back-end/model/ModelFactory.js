import { Sequelize } from 'sequelize';
import RestaurantModel from './RestaurantModel.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const models = {
    Restaurant: RestaurantModel(sequelize),
};

export { sequelize, models };
