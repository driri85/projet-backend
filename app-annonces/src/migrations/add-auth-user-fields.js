'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Users','username', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }, { transaction });
      await queryInterface.addColumn('Users','password', {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }, { transaction });
      transaction.commit();
    } catch(error) {
      transaction.rollback();
    }
  },

  async down (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Users','username', { transaction });
      await queryInterface.removeColumn('Users','password', { transaction });
      transaction.commit();
    } catch(error) {
      transaction.rollback();
    }
  }
};
