'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Get user and category IDs
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE username IN ('jean_dupont', 'marie_martin', 'pierre_bernard') LIMIT 3",
      { type: Sequelize.QueryTypes.SELECT }
    );
    const categories = await queryInterface.sequelize.query(
      "SELECT id FROM Categories ORDER BY id LIMIT 6",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (users.length === 0 || categories.length === 0) {
      return;
    }

    const userIds = users.map(u => u.id);
    const categoryIds = categories.map(c => c.id);

    await queryInterface.bulkInsert('Annonces', [
      {
        title: 'iPhone 13 Pro - Comme neuf',
        description: 'iPhone 13 Pro en excellent état, très peu utilisé. Avec tous les accessoires.',
        price: 899.99,
        status: 'published',
        user_id: userIds[0],
        category_id: categoryIds[0],
        filepath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'MacBook Air M1 2020',
        description: 'MacBook Air 13 pouces avec puce M1, batterie excellent état.',
        price: 1299.99,
        status: 'published',
        user_id: userIds[0],
        category_id: categoryIds[0],
        filepath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Manteau d\'hiver - Femme - Taille M',
        description: 'Manteau d\'hiver noir, brand Zara, très chaud et confortable.',
        price: 89.99,
        status: 'published',
        user_id: userIds[1],
        category_id: categoryIds[1],
        filepath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Canapé 3 places - Beige',
        description: 'Canapé en tissu beige, 3 places, état neuf, jamais utilisé.',
        price: 599.99,
        status: 'published',
        user_id: userIds[1],
        category_id: categoryIds[2],
        filepath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Harry Potter - Collection complète',
        description: '7 livres de la série Harry Potter, édition française, en bon état.',
        price: 79.99,
        status: 'published',
        user_id: userIds[2],
        category_id: categoryIds[3],
        filepath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Vélo de route - Trek Domane',
        description: 'Vélo de route Trek Domane 2019, 52cm, très bien entretenu.',
        price: 749.99,
        status: 'published',
        user_id: userIds[2],
        category_id: categoryIds[4],
        filepath: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Annonces', {
      title: [
        'iPhone 13 Pro - Comme neuf',
        'MacBook Air M1 2020',
        'Manteau d\'hiver - Femme - Taille M',
        'Canapé 3 places - Beige',
        'Harry Potter - Collection complète',
        'Vélo de route - Trek Domane'
      ]
    }, {});
  }
};
