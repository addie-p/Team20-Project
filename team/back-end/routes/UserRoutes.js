const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('../auth/passport');
const User = require('../model/UserModel');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Failed to register user', error });
    }
});

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.status(200).json({ message: 'Logged in successfully', user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
