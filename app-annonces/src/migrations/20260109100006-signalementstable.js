'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Signalements', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.DataTypes.ENUM,
        values: ['new', 'in-progress', 'processed', 'rejected'],
        defaultValue: 'new',
        allowNull: false
      },
      response: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true
      },
      processedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true
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
        allowNull: true,
        references: { model: 'Users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.dropTable('Signalements');
  }
};
