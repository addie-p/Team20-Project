const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");


// Initialize Sequelize
const sequelize = new Sequelize({
 dialect: "sqlite",
 storage: path.join(__dirname, "../scripts/database.sqlite"),
});


// Define the User model
const User = sequelize.define(
 "User",
 {
   username: {
     type: DataTypes.STRING,
     unique: true,
     allowNull: false,
   },
   password: {
     type: DataTypes.STRING,
     allowNull: false,
   },
 },
 {
   timestamps: false, // Disable automatic timestamps
 }
);


// Sync the database
(async () => {
 try {
   await sequelize.sync();
   console.log("Database synced.");
 } catch (error) {
   console.error("Database sync failed:", error);
 }
})();


module.exports = { sequelize, User };
