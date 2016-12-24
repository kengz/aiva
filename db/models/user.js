module.exports = function fn(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    adapter: DataTypes.STRING,
    userid: DataTypes.STRING,
    username: DataTypes.STRING,
    envelope: DataTypes.TEXT,
  }, {
    classMethods: {
      // associate(models) {
      // associations can be defined here
      // },
    },
  })
  return User
}
