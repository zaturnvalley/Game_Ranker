'use strict';
module.exports = function(sequelize, DataTypes) {
  var game = sequelize.define('game', {
    title: DataTypes.STRING,
    apiId: DataTypes.STRING,
    imgURL: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.game.belongsToMany(models.user, {through: 'gamesUsers'});
        models.game.hasMany(models.rating);
        models.game.hasMany(models.review);
      }
    }
  });
  return game;
};