const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

//GET/api/users - Get the current authenticated user
router.get('/', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
}));

//POST/api/user creates a new user.
router.post('/', asyncHandler(async (req, res) => {
    try {
        //Create a new user 
        await User.create(req.body);
        res.status(201).json({ 'message': 'Account successfully created!' });
        //set location header to "/"
        res.location('/');
    } catch (error) {
        //handle validation errors
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            //handle other errors
            //res.status(500).json({ message: error.message });
            throw error;
        }
    }
}));


module.exports = router;