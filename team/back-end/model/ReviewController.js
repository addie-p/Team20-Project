import { models } from '../../model/ModelFactory.js';

export const addReview = async (req, res) => {
    try {
        const { userId, restaurantId, rating, reviewText } = req.body;
        const existingReview = await models.Review.findOne({ where: { userId, restaurantId } });

        if (existingReview) {
            return res.status(400).json({ message: 'Review already exists for this restaurant.' });
        }

        const newReview = await models.Review.create({ userId, restaurantId, rating, reviewText });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add review.' });
    }
};

export const getReviewsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const reviews = await models.Review.findAll({ where: { restaurantId } });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};
