const express = require('express');
const app = express();
const initRoutes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config({quiet: true});

const PORT = process.env.PORT;

const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initRoutes(app);

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log('Server running on port', PORT);
    });
}

module.exports = app;
