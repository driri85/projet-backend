'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('ImageAnnonces', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      url: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      ordering: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      annonce_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Annonces', key: 'id' },
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
    await queryInterface.dropTable('ImageAnnonces');
  }
};
