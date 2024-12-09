const express = require('express');
const passport = require('../auth/passport');
const UserController = require('../controller/UserController');


const router = express.Router();


// Register Route
router.post('/register', UserController.register);


// Login Route
router.post('/login', passport.authenticate('local'), UserController.login);


// Logout Route
router.get('/logout', UserController.logout);


module.exports = router;




