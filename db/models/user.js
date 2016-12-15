'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    adapter: DataTypes.STRING,
    userid: DataTypes.STRING,
    username: DataTypes.STRING,
    profile: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};