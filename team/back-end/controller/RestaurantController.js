//import { models } from '../../model/ModelFactory.js';
const { models } = require('../model/ModelFactory');


const getAllRestaurants = async (req, res) => {
    try {
      const restaurants = await models.Restaurant.findAll();
  
      // Correctly map and sanitize database response
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
        };
      });
  
      res.status(200).json(formattedRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  };

//   const getAllRestaurants = async (req, res) => {
//     try {
//       // Simulated Data Response for Testing
//       const sampleData = [
//         {
//           id: 1,
//           name: "Test Restaurant",
//           cuisine: "Italian",
//           full_address: "123 Main St, Springfield, MA",
//           latitude: 42.101,
//           longitude: -72.589,
//           rating: 4.5,
//           reviews: 150,
//         },
//       ];
      
//       console.log("Test GET request received.");
//       res.status(200).json(sampleData); // Return test data
//     } catch (error) {
//       console.error("Error in test GET request:", error);
//       res.status(500).json({ message: "Test GET request failed." });
//     }
//   };
  

const addRestaurant = async (req, res) => {
    try {
        const { name, cuisine, location, rating, visited } = req.body;
        const newRestaurant = await models.Restaurant.create({ name, cuisine, location, rating, visited });
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add restaurant.' });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRestaurant = await models.Restaurant.update(req.body, { where: { id } });
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update restaurant.' });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
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