var db = require('../models');

db.user.create({email: 'test@test.com', firstName: 'test', lastName: 'tester', password: 'test1234'}).then(function() {
  console.log('Created user');
});