const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
require('dotenv').config({quiet: true});

const db = {};

// Use explicit options; default to container internal port 3306
const dbInstance = new Sequelize(
  process.env.MARIADB_DATABASE || 'monannonce',
  process.env.MARIADB_USERNAME || 'root',
  process.env.MARIADB_PASSWORD || 'root',
  {
    host: process.env.MARIADB_HOST || 'db',
    port: Number(process.env.MARIADB_PORT) || 3306,
    dialect: 'mariadb',
    logging: false,
    pool: { max: 10, min: 0, idle: 10000, acquire: 60000 },
    dialectOptions: { connectTimeout: 60000 },
    retry: { max: 5 },
  }
);

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