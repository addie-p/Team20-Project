// this file is used for TESTING purposes - to test if fetching from db works
const { sequelize, models } = require('./model/ModelFactory');

async function testFetchRestaurants() {
  try {
    // connect to db
    await sequelize.authenticate();
    console.log('Connection worked');

    // fetch all restaurants
    const restaurants = await models.Restaurant.findAll();

    // log if no restaurants are fetched
    if (restaurants.length === 0) {
      console.log('No restaurants');
    } else {
      console.log(JSON.stringify(restaurants, null, 2));
    }
  } catch (error) {
    console.error('Error fetching', error);
  } finally {
    // close connection
    await sequelize.close();
  }
}

testFetchRestaurants();
