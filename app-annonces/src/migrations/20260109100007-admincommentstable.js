'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('AdminComments', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      comment: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      annonce_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Annonces', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      admin_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('AdminComments');
  }
};
