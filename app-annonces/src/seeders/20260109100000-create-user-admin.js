'use strict';
const bcrypt = require('bcryptjs');
require('dotenv').config({quiet: true});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashpassword = await bcrypt.hash("MotDePasse123", parseInt(process.env.SALT));
    await queryInterface.bulkInsert('Users', [{
      firstname: "Soufian",
      lastname: "Admin",
      username: "contact@soufian-a.net",
      password: hashpassword,
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users',{ username: "contact@soufian-a.net" });
  }
};