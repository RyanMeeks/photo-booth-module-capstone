'use strict';
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const fs = require('fs');
require('dotenv').config();
const {DATABASE_URL} = require('./config')
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { MusicCharts } = require('./music/models')
 
mongoose.Promise = global.Promise;
//userRouter can be used..
const app = express();
app.use(morgan('common'));

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
  });
  
const jwtAuth = passport.authenticate('jwt', {session: false});

app.use(express.static('public'));


app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'working!'
    });
});
//add endpoints.. app.use on a router file

if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
            console.info(`Your app is listening on port ${this.address().port}`);
    });
    mongoose.connect(DATABASE_URL)
}

module.exports = app;