'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // The generated version of this file had a bare type on each of these
      // three columns, exactly like the model. Everything marked below is
      // yours to add, and it has to match what you put in models/user.cjs.
      email: {
        type: Sequelize.STRING,
        allowNull: false,        // <-- you add
        unique: true             // <-- you add
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false         // <-- you add
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,        // <-- you add
        defaultValue: 'member'   // <-- you add
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
