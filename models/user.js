'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "Invalid Email Address"
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'Name must be between 1 and 99 characters'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8,99],
          msg: 'Password must be between 8 and 99 characters'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(createdUser, options, cb) {
        var hash = bcrypt.hashSync(createdUser.password, 10);
        createdUser.password = hash;
        cb(null, createdUser);
      }
    },

    classMethods: {
      associate: function(models) {
        models.user.belongsToMany(models.game, {through: 'gamesUsers'});
      }
    },

    instanceMethods: {
      validPassword: function (password) {
        return bcrypt.compareSync(password, this.password);
      },

      toJSON: function() {
        var jsonUser = this.get();
        delete jsonUser.password;
        return jsonUser;
      }
    }
  });
  return user;
};