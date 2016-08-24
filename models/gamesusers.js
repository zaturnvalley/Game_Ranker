'use strict';
module.exports = function(sequelize, DataTypes) {
  var gamesUsers = sequelize.define('gamesUsers', {
    gameId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return gamesUsers;
};