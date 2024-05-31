'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

//Middleware to authenticate the request using Basic Authentication
exports.authenticateUser = async (req, res, next) => {
    let message;  //store the message to display

    const credentials = auth(req);

    if (credentials) {
        //look up the user by email address
        const user = await User.findOne({ where: { emailAddress: credentials.name } });
        if (user) {
            //usebcrypt to compare the provided password with the stored hashed password
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated) { //if the password match
                console.log(`Authentication successful for email: ${user.emailAddress}`);

                //store the user on Request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for email: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for email: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }
    //if user authentication failed
    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    }
};

