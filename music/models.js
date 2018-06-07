'use strict';

const mongoose = require('mongoose')
const Schema = mongoose.Schema;
 

const songSchema = mongoose.Schema({
    position: {type: Number, required: false},
    artist: String,
    title: String
});


const musicChartSchema = mongoose.Schema({
    chart: {type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
});



const musicListSchema = mongoose.Schema({
    listName: {type: String, required: true},
    songs: [{type: Schema.Types.ObjectId, ref: 'Song'}]
})

//[{type: Schema.Types.ObjectId, ref: 'Song'}]


// musicChartSchema.virtual('artistTitleString').get(function() {
//     return `${this.list.artist} - ${this.list.title}`;
// });

// musicChartSchema.virtual('rank').get(function() {
//     const rankSongs = this.list.sort((a, b) => {return b.postion - a.position;})[0] || {};
//     return rankSongs.position;
// });

// musicChartSchema.methods.serialize = function() {
//     return {
//         position: this.position,
//         artist: this.artist,
//         title: this.title
//     };
// };


const Song = mongoose.model('Song', songSchema);
const MusicChart = mongoose.model('MusicChart', musicChartSchema);
const MusicList = mongoose.model('MusicList', musicListSchema)

module.exports = { MusicChart, Song, MusicList };