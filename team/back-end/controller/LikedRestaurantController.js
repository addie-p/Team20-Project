const { models } = require('../model/ModelFactory');

exports.getLikedRestaurants = async (req, res) => {
  try {
    const likedRestaurants = await models.LikedRestaurant.findAll();
    res.status(200).json(likedRestaurants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch liked restaurants.' });
  }
};

exports.addLikedRestaurant = async (req, res) => {
  try {
    const { name, cuisine, full_address, rating } = req.body;
    const newLikedRestaurant = await models.LikedRestaurant.create({
      name, cuisine, full_address, rating,
    });
    res.status(201).json(newLikedRestaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add liked restaurant.' });
  }
};

exports.deleteLikedRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    await models.LikedRestaurant.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete liked restaurant.' });
  }
};
