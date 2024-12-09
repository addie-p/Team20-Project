const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

//initialize seuquelite with SQLite
const sequelize = new Sequelize({
 dialect: "sqlite",
 storage: path.join(__dirname, "../scripts/database.sqlite"),
});

//user model
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
   timestamps: false, 
 }
);


// sync database
(async () => {
 try {
   await sequelize.sync();
   console.log("Database synced.");
 } catch (error) {
   console.error("Database sync failed:", error);
 }
})();

//export sequelize instance
module.exports = { sequelize, User };
