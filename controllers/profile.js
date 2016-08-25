//Requirements
var express = require('express');
var request = require('request');
// var Sequelize = require('sequelize');
var router = express.Router();
var path = require('path');
var isLoggedIn = require('../middleware/isLoggedIn');

var db = require('../models');

//Routes
router.get("/:id", isLoggedIn, function(req,res){
  db.sequelize.query(`
        SELECT
          users.id AS userId,
          games.id AS gameId,
          games.imgURL,
          games.title,
          games.apiId,
          ratings.rating,
          reviews.review,
          users.firstName
        FROM users
          LEFT JOIN gamesUsers 
            ON users.id = gamesUsers.userId 
          LEFT JOIN games 
            ON gamesUsers.gameId = games.id 
          LEFT JOIN ratings 
            ON users.id = ratings.userId 
              AND games.id = ratings.gameId
          LEFT JOIN reviews 
            ON users.id = reviews.userId
              AND games.id = reviews.gameId 
        WHERE users.id = ?`, 
      {replacements: [req.params.id], 
      type: db.sequelize.QueryTypes.SELECT
  }).then(function(data) {
    res.render('profile', {data: data});
    console.log(data[0]);
  });
});

// router.delete("/game/:gameid", function(req, res){
//   db.review.destroy({
//     where: {
//       review: 
//     }
//   });
//   res.redirect("/" + req.user.id);
// });

router.put("/:id", function (req, res){
  db.editReview(req.params.name, req.body);

  res.send({message: 'success'});
});

router.get("/:id/edit", function(req, res){
  var team = teamService.getTeam(req.params.name);

  res.render("id/edit", {team: team});
});
module.exports = router;