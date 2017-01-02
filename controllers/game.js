//Requirements
var express = require('express');
var request = require('request');
var router = express.Router();
var path = require('path');

var db = require('../models');

//Routes
router.get('/:id', function(req, res){
var qs = {
    fields: '*'
  }
  request({ 
    url: 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/' + req.params.id,
    qs: qs,
    headers: {
      'X-Mashape-Authorization': 'hXLe4J3n8mmsh2eE87CZRHjApjC4p1MWaVZjsngoSvtQyXUOD9'
    }
  }, function(error, response, body){
    var data = JSON.parse(body);
    var game = db.game;
    var usersgames = db.usersgames;
    if(!error){
      res.render('game', {data: data[0], game: game, usersgames: usersgames});
    } else {
      console.log('error', error)
      res.send("Nope! Didn't work. Looks like there was an error. :'(");
    }  
  });
});

router.post('/:id', function(req, res){
  db.user.find({
    where: {
      id: req.user.id
    }
  }).then(function(user){
    if(user){
      user.createGame({
        title: req.body.title,
        apiId: (req.body.apiId).toString(),
        imgURL: req.body.imgURL
      }).then(function(game){
        game.createReview({
          gameId: game.id, 
          userId: user.id, 
          review: req.body.review
        }).then(function(review){
          game.createRating({
            gameId: game.id,
            userId: user.id,
            rating: req.body.rating
          });
        }).then(function(rating){
          res.redirect("/game/" + req.body.apiId);
        });
      });
    } else {
        req.flash('error', 'You must be logged in to access');
        res.redirect('/auth/login');
        return;
      }
  });
});

module.exports = router;