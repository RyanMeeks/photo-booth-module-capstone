'use strict';

const mongoose = require('mongoose');
 
const musicChartSchema = mongoose.Schema({
    chart: {type: String, required: true},
    list: [{
        position: Number,
        artist: String,
        title: String
    }]
})

musicChartSchema.virtual('artistTitleString').get(function() {
    return `${this.list.artist} - ${this.list.title}`;
});

musicChartSchema.virtual('rank').get(function() {
    const rankSongs = this.list.sort((a, b) => {return b.postion - a.position;})[0] || {};
    return rankSongs.position;
});

musicChartSchema.methods.serialize = function() {
    return {
        position: this.position,
        artist: this.artist,
        title: this.title
    };
};

const MusicCharts = mongoose.model('MusicCharts', musicChartSchema);

module.exports = {MusicCharts};