const express = require('express');
const app = express();
const initRoutes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
require('dotenv').config({quiet: true});

const PORT = process.env.PORT;

// Load Swagger documentation
const swaggerDocument = YAML.load(path.join(__dirname, '../../docs/swagger.yaml'));

app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

initRoutes(app);

app.listen(PORT, () => {
    console.log('Server running on port', PORT);
});
