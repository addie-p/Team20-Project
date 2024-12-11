const express = require('express');
const passport = require('../auth/passport');
const UserController = require('../controller/UserController');


const router = express.Router();


//route for register
router.post('/register', UserController.register);


// route for login
router.post('/login', passport.authenticate('local'), UserController.login);


// route for logout
router.get('/logout', UserController.logout);


module.exports = router;




