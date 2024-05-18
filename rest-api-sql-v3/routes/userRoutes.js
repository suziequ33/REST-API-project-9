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


//GET/api/users
router.get('/users', asyncHandler(async (req, res) => {
    let user = await User.findAll();
    res.json(user);
}));

//POST/api/user creates a new user.
router.post('/user', asyncHandler(async (req, res) => {
    try{
    const user = await User.create(req.body);
    res.location('/');
    res.status(201).end();
    } catch (error) {
        res.staus(400).json({ error: error.message });
    }
}));


module.exports = router;