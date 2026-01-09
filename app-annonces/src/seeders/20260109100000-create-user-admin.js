'use strict';
const bcrypt = require('bcryptjs');
require('dotenv').config({quiet: true});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const hashpassword = await bcrypt.hash("MotDePasse123", parseInt(process.env.SALT));
    await queryInterface.bulkInsert('Users', [{
      firstname: "Adrien",
      lastname: "RANDONNET",
      username: "contact@arsdv.site",
      password: hashpassword,
      role: 'admin'
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users',{ username: "contact@arsdv.site" });
  }
};