const express = require('express');
const { models } = require("../model/ModelFactory");

const {
  getLikedRestaurants,
  addLikedRestaurant,
  deleteLikedRestaurant,
} = require('../controller/LikedRestaurantController.js');

// express router instance
const router = express.Router();

// get liked restaurants
router.get('/', getLikedRestaurants);

// add liked restaurants
router.post("/", async (req, res) => {
    try {
      // use req body to add entry to db table
      const likedRestaurant = await models.LikedRestaurant.create(req.body);
      // send as json
      res.status(201).json(likedRestaurant);
    } catch (error) {
      console.error("Error adding liked restaurant:", error);
      res.status(500).json({ message: "Failed to add liked restaurant" });
    }
  });
// delete liked restaurant by id
router.delete('/:id', deleteLikedRestaurant);

module.exports = router;
