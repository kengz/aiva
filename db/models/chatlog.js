'use strict';
// create with:
// sequelize model:create --name Chatlog --attributes "adapter:string"

module.exports = function(sequelize, DataTypes) {
  var Chatlog = sequelize.define('chatlog', {
    adapter: DataTypes.STRING,
    userid: DataTypes.STRING,
    username: DataTypes.STRING,
    room: DataTypes.STRING,
    incoming: DataTypes.BOOLEAN,
    method: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Chatlog;
};
