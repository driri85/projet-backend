'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn('Annonces', 'category_id', {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'Categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      }, { transaction: t });
      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Annonces', 'category_id');
  }
};
