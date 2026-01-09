const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
require('dotenv').config({quiet: true});

const db = {};

const dbInstance = new Sequelize(`mariadb://${process.env.MARIADB_USERNAME || 'root'}:${process.env.MARIADB_PASSWORD || 'root'}@${process.env.MARIADB_HOST || 'db'}:${process.env.MARIADB_PORT || 3307}/${process.env.MARIADB_DATABASE || 'monannonce'}`);

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