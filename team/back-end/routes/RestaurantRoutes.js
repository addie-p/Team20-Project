const express = require('express');
const { getAllRestaurants, addRestaurant, updateRestaurant, deleteRestaurant, filterRestaurants} = require('../controller/RestaurantController.js');


const router = express.Router();
// path to get all restaurants (primarily used for testing)
router.get('/getrestaurants', getAllRestaurants);
// sample paths for adding, modifying, or deleting restaurants
router.post('/restaurants', addRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.post('/restaurants/filter', filterRestaurants);


module.exports = router;
