'use strict';
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');

const {PORT, DATABASE_URL} = require('./config')

const app = express();
app.use(express.static('public'));


if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
            console.info(`Your app is listening on port ${this.address().port}`);
    });
}

module.exports = app