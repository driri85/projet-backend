const annoncesRoutes = require('./annonces');
const authRoutes = require('./auth');
// const userRoutes = require('./users');

const initRoutes = (app) => {
    app.use('/', authRoutes);
    app.use('/home', (req, res, next) => {
        res.status(200).json({
            message: 'Hello world !'
        });
    });
    app.use('/annonces', annoncesRoutes);
    // app.use(userRoutes);
}

module.exports = initRoutes;