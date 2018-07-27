'use strict'
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb');
const mocha = require('mocha');
const chai = require('chai');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = chai.expect;
const faker = require('faker');
const {runServer, closeServer, app} = require('../server');
const { Song, MusicChart, MusicList } = require('../music/models');
const { User } = require('../users/models');
const {TEST_DATABASE_URL, PORT} = require('../config');
const express = require('express');
const router = require('../auth/router');


chai.use(chaiHttp);
//globals
let seedMusicListData;
let userOne;


function seedUserDataBase() {
    userOne = new User({
        username: "spongebob",
        password: "squarepants"
    })
    return User.hashPassword(userOne.password)
    .then(hash => {
        return User.create({
            username: "spongebob",
            password: hash,
            firstName: "bob",
            lastName: "Thomas"
        })
    }).then(function () {
        console.info('seeding LIST data');
        seedMusicListData = generateMusicListData();
        return MusicList.insertMany(seedMusicListData)
    }).then((list) => {
        let request = new Song({
            position: 1,
            chart: "",
            artist: "billy J",
            title: "Piano Man",
            username: "spongebob"
        })
        return request.save()
        .then((song) => {
            list[0].songs.push(song);
            console.log("new", list[0].songs)//ok.. so it adds a song here.. how do i save on the backend?
            console.log("fdsa", list[0])
            return list[0].save();
            
        }).then((list) => {
            console.log("this new list", list);
            return list;
        })
    }).catch((e)=> {
        console.log(e)
    });
}

function seedMusicChartData() {
    console.info('seeding CHART data');
    const seedMusicChartData = [];
    
    for (let i=1; i<=10; i++) {
        seedMusicChartData.push(generateMusicChartData());
    }
    return MusicChart.insertMany(seedMusicChartData)
}

function generateMusicListData() {;
    return [{
        listName: listName,
        username: userOne.username,
        songs: []
    }]
}

function generateSongData() {
    MusicList.findOne({listName}).then((NewList) => {

   
    const title = [faker.hacker.noun(), faker.hacker.noun(), faker.hacker.noun()];
    const artists = [faker.name.findName(), faker.name.findName(), faker.name.findName()];
    const songToPost = new Song ({
        position: 1,
        chart: '',
        title: title[Math.floor(Math.random() * Math.floor(2))],
        artist: artists[Math.floor(Math.random() * Math.floor(2))],
        username: userOne.username
    });
    songToPost.save().then((song) => {
        if(!NewList.songs) {
            NewList.songs = [];
        }
        NewList.songs.push(song);
        console.log(NewList)
        return NewList.save();
    })
    
})
    
}

////database teardown
function tearDownDb(){
    console.warn('Deleting Database');
    return mongoose.connection.dropDatabase();
}

let token;
const listName = "Party Time1";

describe('Login API Endpoint Testing', () => {
    
    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedUserDataBase() 
    });

    afterEach(function() {
        return tearDownDb();
    })

    after(function() {
        return closeServer();
    });

    describe('/POST Register New User and Login', function() {
        it('Register new User', function() {
            return chai.request(app)
                .post('/api/users')
                .send({username:"bobby", password:"green123"})
                .then((res) => { 
                    res.should.have.status(201);
                }), function(err) {
                    console.log(err);
                };
        });
        it('Should login and create authToken', function() {
            return User.find().then((users)=> {
            return chai.request(app)
                .post('/api/auth/login')
                .send({username: userOne.username, password: userOne.password})
                .then((res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('authToken'); 
                    token = res.body.authToken;
                })
            })
        });
    

        it('Should use the token to login to the protected API', function () {
            return chai.request(app)
                .get('/api/protected')
                // we set the auth header with our token
                .set('Authorization', "Bearer " + token)
                .then((res) => {
                    res.should.have.status(200);
                });
        });
    });
    describe('/POST ENDPOINTS', function() {
        it('should /POST a NEW LIST', function() {
            return chai.request(app)
            .post(`/music-list/`)
            .set('Authorization', 'Bearer ' + token)
            .send({listName})
            .then(function(res) {                
                res.should.have.status(200);
                res.body.listName.should.be.a('string');
                res.body.username.should.equal(`${userOne.username}`);
            }), function (err) {
                console.log(err)
            };
        });

        it('should /POST a new song to a specific, existing list', function() {
            console.log(listName);
            return chai.request(app)
            .post(`/music-list/${listName}`)
            .set('Authorization', 'Bearer ' + token)
            .send({artist: "Ryan Meeks", title: "Get Down On It"})
            .then(function(res) {
                console.log(res.body)
                console.log(res.body.songs[0])
                console.log("Text here for songs")
                res.should.have.status(200);
                expect(res.body.listName).to.equal(`${listName}`)
                expect(res.body.songs[0]).to.have.all.keys('artist', 'title', '__v', '_id', 'chart', 'position', 'username')
            })
        });
    })

    describe('/GET endpoints', function() {
        it('should get all LISTS of music', function() {
            return chai.request(app)
            .get('/music-list/')
            .set('Authorization', 'Bearer ' + token)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res.body.lists[0]).to.have.keys("__v", "_id", "listName", "songs", "username")
            })
        })

        it('should get a list of songs from an individual list of music', function() {
            return chai.request(app)
            .get(`/music-list/${listName}`)
            .set('Authorization', 'Bearer ' + token)
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res.body).to.have.keys("songs", "_id", "listName", "username", "__v")
            })
        })
       it('should get all the songs on the TOP 50 Chart', function() {
           return chai.request(app)
           .get('/topcharts')
           .set('Authorization', 'Bearer ' + token)
           .then(function(res) {
               expect(res).to.have.status(200);
               expect(res.body.list).to.be.an('array');
               console.log(listName);
               console.log("listname here")
            })
        })
            
        it('should DELETE a list', function() {
            let _res;
            return MusicList
            .findOne({listName: listName})
            .then(function(res) {
                _res = res.listName;
                return chai.request(app)
                .delete(`/music-list/${_res}`)
                .set('Authorization', 'Bearer ' + token);
            })
            .then((res) => {
                expect(res).to.have.status(204);
            })
        })

        it('should delete a song', ()=> {
            let _res;
            return MusicList
            .findOne({listName: listName})
            .then((res) => {
                _res = res.songs[0]._id
                return chai.request(app)
                .delete(`/${_res}`)
                .set('Authorization', 'Bearer ' + token);
            })
            .then((res)=> {
                expect(res).to.have.status(204);
            })
        })
       
       
       
       
       
       
       
       
       
       
       
       
       
        // it('should get a single list of music', () => {
        //     return chai.request(app)
        //         .get(`/music-list/${listName}`)
        //         .set('Authorization', "Bearer " + token)
        //         .then(function(res) {
        //             res.should.have.status(200);
        //             res.should.be.an('Object');
        //         });
        // })
    })


})


   