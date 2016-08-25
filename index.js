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
  res.render('index');
});

app.get('/results', function(req, res){
  var qs = {
    search: req.query.q,
    fields: 'name',
    limit: 15,
    offset: 0,
    order: 'release_dates.date:desc',
    r: 'json'
  }
  request({ 
    url: 'https://igdbcom-internet-game-database-v1.p.mashape.com/games/',
    qs: qs,
    headers: {
      'X-Mashape-Authorization': 'hXLe4J3n8mmsh2eE87CZRHjApjC4p1MWaVZjsngoSvtQyXUOD9'
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

app.get('/mylists', function(req, res){
  res.render('mylists');
});

app.get('/charts', function(req,res){
  res.render('charts');
});

app.use("/game", gameCtrl);
app.use("/profile", profileCtrl);
app.use('/auth', require('./controllers/auth'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
