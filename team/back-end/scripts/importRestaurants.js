const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, models } = require('../model/ModelFactory');


const csvFilePath = path.join(__dirname, '../../front-end/source/components/restaurants.csv');


// function to import csv into db
(async function importCSV() {
   try {
       await sequelize.sync({ force: true });
       console.log('Database synchronized.');


       const restaurants = [];


       // read and parse csv
       fs.createReadStream(csvFilePath)
           .pipe(csv())
           .on('data', (row) => {
               try {
                   const restaurant = {
                       // fields to get from csv
                       id: parseInt(row.id, 10),
                       name: row.name,
                       cuisine: row.cuisine,
                       full_address: row.full_address,
                       latitude: parseFloat(row.latitude),
                       longitude: parseFloat(row.longitude),
                       h3: row.h3 || null,
                       rating: row.rating ? parseFloat(row.rating) : null,
                       reviews: row.reviews ? parseInt(row.reviews, 10) : null,
                       price: row.price ? parseInt(row.price, 10) : null,
                       vegetarian: row.vegetarian?.toLowerCase() === 'true',
                       distance: row.distance ? parseFloat(row.distance) : null,
                       image: row.image ? row.image.toString() : "https://via.placeholder.com/300",
                       liked: row.liked ? parseInt(row.liked, 10) : null
                   };
                   // add restaurant to array
                   restaurants.push(restaurant);
               } catch (err) {
                   console.error('Error parsing row:', row, err);
               }
           })
           .on('end', async () => {
               try {
                   // log # of parsed restaurants (for testing)
                   console.log(`${restaurants.length}`);
                   await models.Restaurant.bulkCreate(restaurants);
               } catch (error) {
                   console.error('Error saving data to database:', error);
               }
           })
           .on('error', (err) => {
               console.error('Error reading CSV file:', err);
           });
   } catch (error) {
       console.error('Error importing CSV data:', error);
   }
})();