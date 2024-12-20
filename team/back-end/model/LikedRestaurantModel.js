const { DataTypes } = require('sequelize');

// create structure of liked restaurants table (same as restaurants)
module.exports = (sequelize) => {
  return sequelize.define('LikedRestaurant', {
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
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    visited: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  });
};
