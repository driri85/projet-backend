'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      { name: 'Électronique', description: 'Appareils électroniques et informatiques', slug: 'electronique', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Mobilier', description: 'Meubles et décoration', slug: 'mobilier', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Vêtements', description: 'Vêtements et accessoires', slug: 'vetements', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Véhicules', description: 'Voitures, motos et vélos', slug: 'vehicules', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Immobilier', description: 'Locations et ventes immobilières', slug: 'immobilier', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Loisirs', description: 'Sports, jeux et hobbies', slug: 'loisirs', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Services', description: 'Prestations de services', slug: 'services', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Autres', description: 'Autres catégories', slug: 'autres', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
