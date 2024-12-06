import { Sequelize } from 'sequelize';
import RestaurantModel from './RestaurantModel.js';

import ReviewModel from './ReviewModel.js';


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const models = {
    Restaurant: RestaurantModel(sequelize),
    Review: ReviewModel(sequelize),
};

models.Review.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' });
models.Restaurant.hasMany(models.Review, { foreignKey: 'restaurantId' });

export { sequelize, models };
