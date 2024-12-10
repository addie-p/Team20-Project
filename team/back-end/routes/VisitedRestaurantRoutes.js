const express = require("express");
const { models } = require("../model/ModelFactory");

const {
  getVisitedRestaurants,
  addVisitedRestaurant,
  deleteVisitedRestaurant,
} = require("../controller/VisitedRestaurantController.js");

const router = express.Router();

router.get("/", getVisitedRestaurants);
router.get("/:id", async (req, res) => {
  try {
    const restaurant = await models.VisitedRestaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurant." });
  }
});

router.post("/", async (req, res) => {
  try {
    const visitedRestaurant = await models.VisitedRestaurant.create(req.body);
    res.status(201).json(visitedRestaurant);
  } catch (error) {
    console.error("Error adding visited restaurant:", error);
    res.status(500).json({ message: "Failed to add visited restaurant" });
  }
});
router.delete("/:id", deleteVisitedRestaurant);

module.exports = router;
