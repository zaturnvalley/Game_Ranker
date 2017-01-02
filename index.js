//Requirements
var express = require('express');
var request = require('request');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var passport = require('./config/ppConfig');
var flash = require('connect-flash');
var path = require('path');
var isLoggedIn = require('./middleware/isLoggedIn');
var gameCtrl = require("./controllers/game");
var profileCtrl = require("./controllers/profile");

//Global Variables
var app = express();
var db = require('./models');

//Settings & Use Statements
app.set('view engine', 'ejs');
app.use(require('morgan')('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'abcdefghijklmnopqrstuvwxyz',
  resave : false,
  saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  req.session.user = req.user;
  next();
});

app.use(ejsLayouts);

app.get('/', function(req, res) {
  db.sequelize.query(`
    SELECT
      "users"."id" AS "userId",
      "games"."id" AS "gameId",
      "games"."imgURL",
      "games"."title",
      "games"."apiId",
      "ratings"."rating",
      "reviews"."createdAt",  
      "reviews"."review",
      "users"."firstName"
    FROM "users"
      LEFT JOIN "gamesUsers" 
        ON "users"."id" = "gamesUsers"."userId"
      LEFT JOIN "games" 
        ON "gamesUsers"."gameId" = "games"."id" 
      LEFT JOIN "ratings"
        ON "users"."id" = "ratings"."userId" 
          AND "games"."id" = "ratings"."gameId"
      LEFT JOIN "reviews" 
        ON "users"."id" = "reviews"."userId"
          AND "games"."id" = "reviews"."gameId" 
    WHERE "reviews"."createdAt" IS NOT NULL
    ORDER BY "reviews"."createdAt" DESC
    LIMIT 5`, 
      { type: db.sequelize.QueryTypes.SELECT
  }).then(function(data) {
    res.render('index', {games: data});
  });
});

app.get('/results', function(req, res){
  var qs = {
    search: req.query.q,
    fields: 'name',
    limit: 20,
    offset: 0,
    order: 'release_dates.date:desc',
    r: 'json'
  }
  request({ 
    url: 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/',
    qs: qs,
    headers: {
      'X-Mashape-Authorization': process.env.AUTH
    }
  }, function(error, response, body){
    var data = JSON.parse(body);
    if(!error && response.statusCode == 200){
      res.render('results', {results: data});
    } else {
      res.send("Nope! Didn't work. Looks like there was an error. :'(");
    }
  });
});

app.use("/game", gameCtrl);
app.use("/profile", profileCtrl);
app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
