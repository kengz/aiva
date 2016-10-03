'use strict';
// create with: 
// sequelize migration:create --name create-chatlogs
// run migration:
// sequelize db:migrate
// sequelize db:migrate:undo:all

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chatlogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      adapter: Sequelize.STRING,
      userid: Sequelize.STRING,
      username: Sequelize.STRING,
      room: Sequelize.STRING,
      incoming: Sequelize.BOOLEAN,
      method: Sequelize.STRING,
      message: Sequelize.STRING
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable('chatlogs')
  }
}
