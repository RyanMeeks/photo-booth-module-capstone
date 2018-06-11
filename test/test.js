'use strict'

const mocha = require('mocha');
const chai = require('chai');
const mongoose = require('mongoose');
const faker = require('faker');
const chaiHttp = require('chai-http');
const app = require('../server');
const TEST_DATABASE_URL = require('../config');
const should = chai.should();

chai.use(chaiHttp);

const generateMusicList = function() {
    const listName = "Party Fun";
    const song = {
        artist: "Testy 123",
        title: "Party Time",
        chart: "none",
        position: 1
    }
    return {
        listName: listName,
        songs: {
            song
        }
    }
}

describe('POST /music-list', () => {
    it('should create a music list', () => {
        let newList = generateMusicList();

        return chai.request(app)
        .post('/music-list')
        send(newList)
        .then((newList) => {
            res.should.have.status(200);
            res.should.be.json;
            res.should.be.a('object');
        });


    });
});

describe('PhotBooth Module API Resource', function(){
    it('should return something', function(){
        
        return chai.request(app)
        .get('/')
        .then(function(res){
            res.should.have.status(200);
        });
    });
});