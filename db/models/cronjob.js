

module.exports = function fn(sequelize, DataTypes) {
  const Cronjob = sequelize.define('Cronjob', {
    adapter: DataTypes.STRING,
    userid: DataTypes.STRING,
    pattern: DataTypes.STRING,
    command: DataTypes.TEXT,
  }, {
    classMethods: {
      // associate(models) {
        // associations can be defined here
      // },
    },
  })
  return Cronjob
}
