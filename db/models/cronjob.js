'use strict';
module.exports = function(sequelize, DataTypes) {
  var Cronjob = sequelize.define('Cronjob', {
    adapter: DataTypes.STRING,
    userid: DataTypes.STRING,
    pattern: DataTypes.STRING,
    command: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Cronjob;
};