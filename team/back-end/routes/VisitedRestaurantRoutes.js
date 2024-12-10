const express = require("express");
const { models } = require("../model/ModelFactory");

const {
  getVisitedRestaurants,
  addVisitedRestaurant,
  deleteVisitedRestaurant,
} = require("../controller/VisitedRestaurantController.js");

const router = express.Router();
// creating get and post routes
router.get("/", getVisitedRestaurants);
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
