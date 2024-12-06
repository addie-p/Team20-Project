// import express from 'express';
// import { getAllRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from '../source/controllers/RestaurantController.js';

const express = require('express');
const { getAllRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } = require('../controller/RestaurantController.js');

const router = express.Router();

router.get('/restaurants', getAllRestaurants);
router.post('/restaurants', addRestaurant);
router.put('/restaurants/:id', updateRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

//export default router;

module.exports = router;
