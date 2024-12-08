const { sequelize, models } = require('./model/ModelFactory');

async function testFetchRestaurants() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Connection established successfully.');

    // Fetch all restaurants
    const restaurants = await models.Restaurant.findAll();

    if (restaurants.length === 0) {
      console.log('No restaurants found.');
    } else {
      console.log('Restaurants found:', JSON.stringify(restaurants, null, 2));
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  } finally {
    // Close the connection
    await sequelize.close();
  }
}

testFetchRestaurants();
