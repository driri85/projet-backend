const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
require('dotenv').config();

const db = {};

const dbInstance = new Sequelize(`mariadb://${process.env.MARIADB_USERNAME}:${process.env.MARIADB_PASSWORD}@${process.env.MARIADB_HOST}:${process.env.MARIADB_PORT}/${process.env.MARIADB_DATABASE}`);

// instanciation des différents modèles.
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(dbInstance, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize;
db.dbInstance = dbInstance;

module.exports = db;