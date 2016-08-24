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
    if(!error){
      res.render('game', {data: data[0], game: game, usersgames: usersgames});
    } else {
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
        
      })
    }
  });
  db.game.findOrCreate({
    where: {
      title: req.params.id,
    }
  }).spread(function(game, created){
    db.usersgames.gamefindOrCreate({
      where: {
      review: req.body.reviews,
      rating: req.body.rating
      }
    }).then(function(){
      res.redirect('/:id');
    });
  });
});

// router.put('/:id', function(req, res){
//   db.game.update({
//       avRating: ((avRating * numbRatings)+req.body.rating) / (numbRatings + 1),
//       numbRatings: numbRatings++
//     where: {
//       gameId: req.params.id
//     }
//   }).spread(function(usersgames){
//     db.game.update({
//       where: {

//       }
//     });
//   });
// });

module.exports = router;