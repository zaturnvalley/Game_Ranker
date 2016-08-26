var express = require('express');
var router = express.Router();
var passport = require('../config/ppConfig');
var path = require('path');

var db = require('../models');

router.get('/signup', function(req, res) {
  res.render('auth/signup');
});

router.post('/signup', function(req,res){
  console.log(req.body);
  db.user.findOrCreate({
    where: { email: req.body.email},
    defaults: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    }
  }).spread(function(user, created) {
    if(created) {
      passport.authenticate('local', {
        successRedirect: '/',
        successFlash: 'Account created and logged in'
      })(req, res);
    } else {
      req.flash('error','Email already exists');
      res.redirect('/auth/signup');
    }
  }).catch(function(error) {
    if(error.message == "NaN"){
      req.flash("Please enter a longer password")
    }
    req.flash('error', 'An error occurred: ', + error.message);
    res.redirect('/auth/signup');
  });
});

router.get('/login', function(req, res) {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: 'Invalid username and/or password',
  successFlash: 'You logged in'
}));

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Logged out');
  res.redirect('/');
});

module.exports = router;
