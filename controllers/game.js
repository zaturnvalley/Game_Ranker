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
    url: 'https://api-2445582011268.apicast.io/games/' + req.params.id,
    qs: qs,
    headers: {
      'user-key': process.env.AUTH
    }
  }, function(error, response, body){
    var data = JSON.parse(response.body);
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