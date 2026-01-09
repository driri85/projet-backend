'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = parseInt(process.env.SALT || 10);
    const password = 'TestPassword123';
    const hashedPassword = await bcrypt.hash(password, salt);

    await queryInterface.bulkInsert('Users', [
      {
        firstname: 'Jean',
        lastname: 'Dupont',
        username: 'jean_dupont',
        password: hashedPassword,
        role: 'seller',
        phone_number: '06 12 34 56 78',
        address: '123 Rue de Paris',
        zip_code: '75001',
        city: 'Paris',
        profil_picture: null,
        token: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Marie',
        lastname: 'Martin',
        username: 'marie_martin',
        password: hashedPassword,
        role: 'seller',
        phone_number: '06 87 65 43 21',
        address: '456 Avenue de Lyon',
        zip_code: '75002',
        city: 'Paris',
        profil_picture: null,
        token: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        firstname: 'Pierre',
        lastname: 'Bernard',
        username: 'pierre_bernard',
        password: hashedPassword,
        role: 'seller',
        phone_number: '06 11 22 33 44',
        address: '789 Boulevard Saint-Germain',
        zip_code: '75006',
        city: 'Paris',
        profil_picture: null,
        token: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {
      username: ['jean_dupont', 'marie_martin', 'pierre_bernard']
    }, {});
  }
};
