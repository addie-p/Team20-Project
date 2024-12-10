const { models } = require('../model/ModelFactory');

// fetch liked restaurants from db
exports.getLikedRestaurants = async (req, res) => {
  try {
    const likedRestaurants = await models.LikedRestaurant.findAll();
    res.status(200).json(likedRestaurants);
    // error handling
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liked restaurants.' });
  }
};

// add new liked restaurant to db
exports.addLikedRestaurant = async (req, res) => {
  try {
    // only get relevant details from restaurant entry
    const { name, cuisine, full_address, rating } = req.body;
    // add record to table
    const newLikedRestaurant = await models.LikedRestaurant.create({
      name, cuisine, full_address, rating,
    });
    // send as json
    res.status(201).json(newLikedRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add liked restaurant.' });
  }
};

// delete liked restaurant from db
exports.deleteLikedRestaurant = async (req, res) => {
  try {
    // extract id from req params
    const { id } = req.params;
    // delete records
    await models.LikedRestaurant.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete liked restaurant.' });
  }
};
