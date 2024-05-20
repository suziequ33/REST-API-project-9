const express = require('express');
const router = express.Router();
const { User } = require('../models');

function asyncHandler(cd) {
    return async (req, res, next) => {
        try {
            await cd(req, res, nexr);
        } catch (error) {
            //forward error to the globasl error handler
            next(error);
        }
    }
}


//GET/api/users - Get the current authenticated user
router.get('/users', asyncHandler(async (req, res) => {
   try {
    const user = await User.findOne({ where: { id: req.userId } });
    if (user) {
        res.staus(200).json(user);
    } else {
        res.staus(400).json({ message: 'User not found' });
    }
} catch (error) {
    res.status(500).json({ message: error.message });
}
}));

//POST/api/user creates a new user.
router.post('/user', asyncHandler(async (req, res) => {
    try{
    const user = await User.create(req.body);
    res.status(201).location('/').end();
    } catch (error) {
        if ( error.name === 'SequelizeValidationError') {
        const errors = error.errors.map(err => err.message);
        res.staus(400).json({ errors });
    } else {
        res.status(500).json({ message: error.message });
    }
}
}));


module.exports = router;