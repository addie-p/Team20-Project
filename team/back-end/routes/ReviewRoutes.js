import express from 'express';
import { addReview, getReviewsByRestaurant } from '../source/controllers/ReviewController.js';

const router = express.Router();

router.post('/reviews', addReview);
router.get('/reviews/:restaurantId', getReviewsByRestaurant);

export default router;