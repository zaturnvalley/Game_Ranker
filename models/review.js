'use strict';
module.exports = function(sequelize, DataTypes) {
  var review = sequelize.define('review', {
    gameId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    review: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.review.belongsTo(models.game);
        models.review.belongsTo(models.user);
      }
    }
  });
  return review;
};