'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
require('dotenv').config();
const { PORT, DATABASE_URL} = require('./config')
const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { Song, MusicList, MusicChart} = require('./music/models');
 
mongoose.Promise = global.Promise;
//userRouter can be used..
const app = express();
app.use(morgan('common'));

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(bodyParser.json());
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use(express.static('public'));
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

app.get('/api/protected', jwtAuth, (req, res) => {
    return res.json({
        data: 'working!'
    });
});

 //user POSTS a list to /music-list
 app.post('/music-list', jwtAuth, (req, res) => {
    let musicList = new MusicList ({
        listName: req.body.listName.trim(),
        songs: []
    })
    
    musicList.save().then((doc) => {
        res.send(doc);
    }, (errors) => {
        res.status(400).send(errors);
    });
});

//user GETS all of their lists from /music-list
app.get('/music-list', jwtAuth, (req,res) => {
    MusicList.find().then((lists) => {
        res.send({lists});
    }, (e) => {
        res.status(400).send(e);
    });
});

// //user GETS a single List Displayed
app.get('/music-list/:listName', jwtAuth, (req, res) => {
    let {listName} = req.params;
    
    MusicList.find({listName}).populate("songs").exec().then((list) => {
        if(list.length === 0) {
            return res.status(404).send();
        }
        res.json(list[0]);
        
    }, (e) => {
        res.status(404).send(e);
    });
});


//User adds song to specific list
app.post('/music-list/:listName', jwtAuth, (req, res) => {
    let {listName, artist, title, position, chart} = req.params;
    MusicList.findOne({listName}).then((NewList) => {

    let request = new Song({
        position: 0,
        chart: "",
        artist: req.body.artist,
        title: req.body.title
    });
    request.save().then((song) =>{
        if (!NewList.songs) {
            NewList.songs = [];
        }
        NewList.songs.push(song);
        return NewList.save();
    }).then((list) => {
        res.send(list)
    }).catch((e) => {
        console.log(e)
    })
});
});

//User Views Top Charts GET request
app.get('/topcharts', jwtAuth, (req, res) => {
    MusicChart.find().then((list) => {
        res.send({list});
    }, (e) => {
        res.status(400).send(e);
    })
});



let server;

function runServer(databaseUrl, port = PORT) {

    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  
  // this function closes the server, and returns a promise. we'll
  // use it in our integration tests later.
  function closeServer() {
    return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
  }


if (require.main === module) {
    app.listen(process.env.PORT || 8080, function() {
            console.info(`Your app is listening on port ${this.address().port}`);
    });
    mongoose.connect(DATABASE_URL)
}

module.exports = {app, runServer, closeServer};