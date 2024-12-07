const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Restaurant = sequelize.define('Restaurant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false,  // Since we are using the CSV's `id`
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cuisine: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        full_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        latitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        longitude: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        h3: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        reviews: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        vegetarian: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        distance: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    }, {
        timestamps: false,  // Disable Sequelize's default timestamps
    });

    return Restaurant;
};
