'use strict';

const express = require('express');
const {ObjectID} = require('mongodb');
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

//user POSTS a song to /music
// app.post('/music', (req, res) => {
//     let songRequest = new Song ({
//         position: '',
//         chart: '',
//         title: req.body.title,
//         artist: req.body.artist
//     })
//     songRequest.save().then((song) => {
//         res.send(song);
//     }, (errors) => {
//         res.status(400).send(errors);
//     });
// });

//user GETS single song requests
// app.get('/music', (req, res) => {
//     Song.find().then((songs)=> {
//         res.send({songs});
//     }, (e) => {
//         res.status(400).send(e);
//     });
// });


// user GETS all of their lists to display
app.get('/music-list', jwtAuth, (req,res) => {
    MusicList.find({username: req.user.username}).then((lists) => {
        res.send({lists});   
    }, (errors) => {
        res.status(400).send(errors);
    });
});

// user GETS a single List with it's songs to display
app.get('/music-list/:listName', jwtAuth, (req, res) => {
    let {listName} = req.params;
    MusicList.find({listName}).populate("songs").exec().then((list) => {
        if (list.length === 0) {
            return res.status(404).send();
        }
        res.json(list[0]);
    }, (errors) => {
        res.status(404).send(errors);
    });
});

// user POSTS song to specific, exisiting list
app.post('/music-list/:listName', jwtAuth, (req, res) => {
    let {listName, artist, title, position, chart} = req.params;
    MusicList.findOne({listName}).then((NewList) => {
       let songRequest = {
           position: 0,
           chart: '',
           artist: req.body.artist,
           title: req.body.title,
           username: req.user.username
       }
        Song.findOne({
            artist:songRequest.artist, title: songRequest.title,
            username: songRequest.username
            })
            .then((currentSong) => {
                console.log(currentSong)
                if (currentSong != null) {
                    return res.status(422).send("errors")
                }
                let request = new Song({
                position: 0,
                chart: "",
                artist: req.body.artist,
                title: req.body.title,
                username: req.user.username
                });
        
                request.save().then((song) => {
                    NewList.songs.push(song);
                    return NewList.save();
                })
                .then((list) => {
                    return list.populate("songs").execPopulate();
                })
                .then((list) => {
                    res.send(list)
                }).catch((errors) => {
                    console.info(errors.errors.title.message);
                });
            });
    });
});

 // user POSTS a list to /music-list
 app.post('/music-list', jwtAuth, (req, res) => {
    const inputList = {
        listName: req.body.listName.trim(),
        songs:[],
        username: req.user.username
    }

    MusicList.findOne({listName:inputList.listName}).then((doc)=> {
        if (doc === null) {
            let musicList = new MusicList ({
                listName: inputList.listName,
                songs:[],
                username: inputList.username
            }, (error) => {
                res.status(400).send(error);
            })
    //return an object... if it finds, return error, otherwise, go through.. res.send..
            musicList.save().then((doc) => {
                
                return doc.save();
            }, (errors) => {
                res.status(400).send(errors);
            })
            .then((list)=> {
                return list.populate("musiclists").execPopulate();
            })
            .then((list) => {
                res.send(list)
                
            })
            .catch((e) => {
                console.log(e)
            });
        }
        else {
            res.status(422).send("List Exists")
        }
    }).catch((e)=>{
        res.send(e)
    });
});
//User Views Top Charts GET request
app.get('/topcharts', jwtAuth, (req, res) => {
    MusicChart.find().then((list) => {
        res.send({list});
    }, (errors) => {
        res.status(400).send(errors);
    })
});

//User DELETES an entire list
app.delete('/music-list/:listName', jwtAuth, (req, res) => {
    let {listName} = req.params;
    MusicList.findOneAndRemove({listName})
        .then((list) => {
            if (list === null) {
                return res.status(404).send();
            }
        res.status(204).send();
    });
})

//User DELETES a song from a list using it's UNIQUE ID.
app.delete('/:id', jwtAuth, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Song.findByIdAndRemove(id)
    .then((song) => {
        if (!song) {
            return res.status(404).send();
        }
        return res.status(204).send();
    }).catch((e) => {
        res.status(400).send();
    });
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