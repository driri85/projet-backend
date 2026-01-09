const express = require('express');
const app = express();
const initRoutes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config({quiet: true});
const db = require('./models');

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initRoutes(app);

// Attempt DB connection at startup for visibility
db.dbInstance.authenticate()
	.then(() => console.log('Database connection OK'))
	.catch((err) => console.error('Database connection failed:', err.message));

module.exports = app;
