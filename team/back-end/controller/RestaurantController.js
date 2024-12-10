//import { models } from '../../model/ModelFactory.js';
const { models } = require('../model/ModelFactory');


const getAllRestaurants = async (req, res) => {
    try {
      // get all restaurants in db
      const restaurants = await models.Restaurant.findAll();
    
      // map and format db response w/ correct params
      const formattedRestaurants = restaurants.map((restaurant) => {
        return {
          id: restaurant.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          full_address: restaurant.full_address.trim(),
          latitude: parseFloat(restaurant.latitude),
          longitude: parseFloat(restaurant.longitude),
          h3: restaurant.h3,
          rating: parseFloat(restaurant.rating),
          reviews: parseInt(restaurant.reviews, 10),
          price: restaurant.price ? restaurant.price.toString() : "Not specified",
          vegetarian: restaurant.vegetarian ? "Yes" : "No",
          distance: restaurant.distance ? parseFloat(restaurant.distance) : 0,
          // send image url as link
          image: restaurant.image ?  restaurant.image.toString() : "https://via.placeholder.com/300",
        };
      });
      // send as json
      res.status(200).json(formattedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  };

// add restaurant to db (if needed)
const addRestaurant = async (req, res) => {
    try {
        // get relevant details in req
        const { name, cuisine, location, rating, visited } = req.body;
        // create new entry in db table
        const newRestaurant = await models.Restaurant.create({ name, cuisine, location, rating, visited });
        // send as json
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add restaurant.' });
    }
};

// update restaurant details in db (if needed)
const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        // update entry in db table
        const updatedRestaurant = await models.Restaurant.update(req.body, { where: { id } });
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update restaurant.' });
    }
};

// delete restaurant details from db (if needed)
const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        // delete entry in db table
        await models.Restaurant.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete restaurant.' });
    }
};

module.exports = {
    getAllRestaurants,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
};