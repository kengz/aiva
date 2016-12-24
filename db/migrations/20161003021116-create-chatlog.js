// to create: sequelize migration:create --name create-chatlog
// to run: sequelize db:migrate
// to revert: sequelize db:migrate:undo:all

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Chatlogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      adapter: Sequelize.STRING,
      userid: Sequelize.STRING,
      username: Sequelize.STRING,
      room: Sequelize.STRING,
      incoming: Sequelize.BOOLEAN,
      method: Sequelize.STRING,
      message: Sequelize.STRING,
    })
  },
  down(queryInterface) {
    return queryInterface.dropTable('Chatlogs')
  },
}
