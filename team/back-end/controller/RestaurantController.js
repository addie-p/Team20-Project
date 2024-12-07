//import { models } from '../../model/ModelFactory.js';
const { models } = require('../model/ModelFactory');


const getAllRestaurants = async (req, res) => {
    try {
        // Log to ensure this endpoint is being hit
        console.log("Fetching restaurants from the database...");
    
        // Query the database to fetch all restaurants
        const restaurants = await models.Restaurant.findAll();
    
        // Log the fetched data for debugging purposes
        console.log("Restaurants fetched:", restaurants);
    
        // Respond with the fetched data
        res.status(200).json(restaurants);
      } catch (error) {
        // Log the error for debugging
        console.error("Error fetching restaurants:", error);
    
        // Respond with a 500 status and error message
        res.status(500).json({ message: "Failed to fetch restaurants." });
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