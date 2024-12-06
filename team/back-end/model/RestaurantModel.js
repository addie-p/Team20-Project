import { DataTypes } from 'sequelize';

export default (sequelize) => {
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
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        visited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });
    return Restaurant;
};
