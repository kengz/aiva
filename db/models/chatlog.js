

// create with:
// sequelize model:create --name Chatlog --attributes "adapter:string"

module.exports = function fn(sequelize, DataTypes) {
  const Chatlog = sequelize.define('Chatlog', {
    adapter: DataTypes.STRING,
    userid: DataTypes.STRING,
    username: DataTypes.STRING,
    room: DataTypes.STRING,
    incoming: DataTypes.BOOLEAN,
    method: DataTypes.STRING,
    message: DataTypes.TEXT,
  }, {
    classMethods: {
      // associate(models) {
        // associations can be defined here
        // Chatlog.belongsTo(models.User)
      // },
    },
  })
  return Chatlog
}
