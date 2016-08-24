var db = require('../models');

db.user.find({
  where: {
    id: 1
  }
}).then(function(user) {
  if(user) {
    user.createGame({title: 'Pokemon Red', apiId: '678', imgURL: 'http://67.media.tumblr.com/tumblr_l07u163RZj1qa8q3yo1_1280.jpg'}).then(function(game) {
      console.log('Created game');
      game.createReview({gameId: game.id, userId: user.id, review: 'This is a great game'}).then(function(review) {
        console.log('Created Review');
        game.createRating({gameId: game.id, userId: user.id, rating: 5}).then(function(rating) {
          console.log('Created Rating');
        });
      })
    });
  }
});