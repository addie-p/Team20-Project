//import { DataTypes } from 'sequelize';
const DataTypes = require('sequelize').DataTypes;

module.exports = (sequelize) => {
//export default (sequelize) => {
    const Restaurant = sequelize.define('Restaurant', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
    });
    return Restaurant;
};