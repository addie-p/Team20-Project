const { DataTypes } = require('sequelize');


// create structure of restaurants table
module.exports = (sequelize) => {
   const Restaurant = sequelize.define('Restaurant', {
       id: {
           type: DataTypes.INTEGER,
           primaryKey: true,
           autoIncrement: false,
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
       image: {
           type: DataTypes.STRING,
           allowNull: true,
       },
       liked: {
           type: DataTypes.INTEGER,
           allowNull: true,
       }
   }, {
       timestamps: false,
   });


   return Restaurant;
};