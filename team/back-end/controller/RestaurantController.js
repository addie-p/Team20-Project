import { models } from '../../model/ModelFactory.js';

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await models.Restaurant.findAll();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch restaurants.' });
    }
};

export const addRestaurant = async (req, res) => {
    try {
        const { name, cuisine, location, rating, visited } = req.body;
        const newRestaurant = await models.Restaurant.create({ name, cuisine, location, rating, visited });
        res.status(201).json(newRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add restaurant.' });
    }
};

export const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRestaurant = await models.Restaurant.update(req.body, { where: { id } });
        res.status(200).json(updatedRestaurant);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update restaurant.' });
    }
};

export const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        await models.Restaurant.destroy({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete restaurant.' });
    }
};
