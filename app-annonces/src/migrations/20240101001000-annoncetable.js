'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Annonces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT
      },
      price: {
        allowNull: false,
        type: Sequelize.DataTypes.FLOAT
      },
      filepath: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT
      },
      status: {
        allowNull: false,
        type: Sequelize.DataTypes.ENUM,
        values: ['draft', 'published', 'suspended'],
        defaultValue: 'draft'
      },
      user_id: {
        allowNull: true,
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
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
    await queryInterface.dropTable('Annonces');
  }
};
