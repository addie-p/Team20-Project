const express = require('express');
const { models } = require("../model/ModelFactory");

const {
  getLikedRestaurants,
  addLikedRestaurant,
  deleteLikedRestaurant,
} = require('../controller/LikedRestaurantController.js');

const router = express.Router();

router.get('/', getLikedRestaurants);
router.post("/", async (req, res) => {
    try {
      const likedRestaurant = await models.LikedRestaurant.create(req.body);
      res.status(201).json(likedRestaurant);
    } catch (error) {
      console.error("Error adding liked restaurant:", error);
      res.status(500).json({ message: "Failed to add liked restaurant" });
    }
  });
router.delete('/:id', deleteLikedRestaurant);

module.exports = router;
