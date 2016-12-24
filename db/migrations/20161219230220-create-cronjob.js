

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Cronjobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      adapter: {
        type: Sequelize.STRING,
      },
      userid: {
        type: Sequelize.STRING,
      },
      pattern: {
        type: Sequelize.STRING,
      },
      command: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Cronjobs')
  },
}
