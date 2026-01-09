'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.sequelize.query('ALTER TABLE Categories AUTO_INCREMENT = 1');
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    await queryInterface.bulkInsert('Categories', [
      { 
        name: 'Mobilier', 
        description: 'Meubles et décoration', 
        slug: 'mobilier', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        name: 'Véhicules', 
        description: 'Voitures, motos et vélos', 
        slug: 'vehicules', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        name: 'Immobilier', 
        description: 'Locations et ventes immobilières', 
        slug: 'immobilier', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        name: 'Loisirs', 
        description: 'Sports, jeux et hobbies', 
        slug: 'loisirs', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        name: 'Autres', 
        description: 'Autres catégories', 
        slug: 'autres', 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      {
        name: 'Électronique',
        description: 'Appareils électroniques et informatique',
        slug: 'electronique',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vêtements',
        description: 'Vêtements, chaussures et accessoires',
        slug: 'vetements',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Meubles',
        description: 'Meubles et décoration',
        slug: 'meubles',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Livres',
        description: 'Livres, magazines et médias',
        slug: 'livres',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sports',
        description: 'Articles de sport et loisirs',
        slug: 'sports',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Services',
        description: 'Services divers',
        slug: 'services',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};
