'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const {User} = require('../users/models');

const songSchema = mongoose.Schema({
    position: {type: Number, required: false},
    chart: String,
    artist: String,
    title: String,
    username: {type: String, ref: 'User'}
});

const musicChartSchema = mongoose.Schema({
    chart: {type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});

const musicListSchema = mongoose.Schema({
    username: {type: String, ref: 'User'},
    listName: {type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
})

const Song = mongoose.model('Song', songSchema);
const MusicChart = mongoose.model('MusicChart', musicChartSchema);
const MusicList = mongoose.model('MusicList', musicListSchema)

module.exports = { MusicChart, Song, MusicList };