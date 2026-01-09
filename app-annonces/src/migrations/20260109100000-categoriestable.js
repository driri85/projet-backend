'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('Categories', {
        id: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: true
        },
        slug: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true
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
      }, { transaction: t });
      await t.commit();
    } catch(error) {
      await t.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Categories');
  }
};
