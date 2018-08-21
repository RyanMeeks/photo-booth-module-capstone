'use strict';
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser');

const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
    return jwt.sign({user}, config.JWT_SECRET, {
        subject: user.username,
        expiresIn: config.JWT_EXPIRY,
        algorithm: 'HS256'
    });
};

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());
//User providees a email/passwrod to login

router.post('/login', (req, res, next) => { 
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return res.json(error)
        }
        if (!user) {
            return res.status(401).json({message: info.message})
        }
            const authToken = createAuthToken(user.serialize());
            res.json({authToken});
    })(req, res, next)
    });

const jwtAuth = passport.authenticate('jwt', {session: false});

//the user exchanges a valid JWT for a new one w/ later exp.

router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
});

module.exports = {router};

