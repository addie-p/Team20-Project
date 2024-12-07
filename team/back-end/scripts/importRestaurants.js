const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { sequelize, models } = require('../model/ModelFactory');

// Correct CSV file path
const csvFilePath = path.join(__dirname, '../../front-end/source/components/restaurants.csv');

(async function importCSV() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized.');

        const restaurants = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                try {
                    const restaurant = {
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
                    };
                    restaurants.push(restaurant);
                } catch (err) {
                    console.error('Error parsing row:', row, err);
                }
            })
            .on('end', async () => {
                try {
                    console.log(`Parsed ${restaurants.length} restaurants.`);
                    await models.Restaurant.bulkCreate(restaurants);
                    console.log('Data successfully imported into the database.');
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
