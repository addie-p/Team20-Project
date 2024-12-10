const { models } = require("../model/ModelFactory");

// grabbing all visited restaurants
exports.getVisitedRestaurants = async (req, res) => {
  try {
    const visitedRestaurants = await models.VisitedRestaurant.findAll();
    res.status(200).json(visitedRestaurants);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visited restaurants." });
  }

};

exports.updateVisitedRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { review, rating } = req.body;
    const restaurant = await models.VisitedRestaurant.findByPk(id);

    if (!restaurant) return res.status(404).json({ message: "Restaurant not found." });

    restaurant.review = review;
    restaurant.rating = rating;
    await restaurant.save();

    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to update restaurant review." });
  }
};


exports.addVisitedRestaurant = async (req, res) => {
  try {
    const { name, cuisine, full_address, rating } = req.body;
    const newVisitedRestaurant = await models.VisitedRestaurant.create({
      name,
      cuisine,
      full_address,
      rating,
    });
    res.status(201).json(newVisitedRestaurant);
  } catch (error) {
    res.status(500).json({ error: "Failed to add visited restaurant." });
  }
};


// deleting a visited restaurant to Visited Restaurants table in SQLite
exports.deleteVisitedRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    await models.VisitedRestaurant.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete visited restaurant." });
  }
};
