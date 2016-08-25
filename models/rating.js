'use strict';
module.exports = function(sequelize, DataTypes) {
  var rating = sequelize.define('rating', {
    gameId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    rating: DataTypes.NUMERIC
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.rating.belongsTo(models.game);
        models.review.belongsTo(models.user);
      }
    }
  });
  return rating;
};