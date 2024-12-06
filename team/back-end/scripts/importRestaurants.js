import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { sequelize, models } from '../model/ModelFactory.js';

const csvFilePath = path.resolve('./team/front-end/source/components/restaurants.csv');

(async function importCSV() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized.');

        const restaurants = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const restaurant = {
                    id: parseInt(row.id),
                    name: row.name,
                    cuisine: row.cuisine,
                    full_address: row.full_address,
                    latitude: parseFloat(row.latitude),
                    longitude: parseFloat(row.longitude),
                    h3: row.h3 || null,
                    rating: parseFloat(row.rating) || null,
                    reviews: parseInt(row.reviews) || null,
                };
                restaurants.push(restaurant);
            })
            .on('end', async () => {
                console.log(`Parsed ${restaurants.length} restaurants.`);
                
                await models.Restaurant.bulkCreate(restaurants);
                console.log('Data successfully imported into the database.');
            });
    } catch (error) {
        console.error('Error importing CSV data:', error);
    }
})();
