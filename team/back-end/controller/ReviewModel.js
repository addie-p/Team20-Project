import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Review = sequelize.define('Review', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        restaurantId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        reviewText: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    });
    return Review;
};