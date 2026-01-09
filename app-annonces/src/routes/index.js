const annoncesRoutes = require('./annonces');
const authRoutes = require('./auth');
const categoriesRoutes = require('./categories');
const signalementsRoutes = require('./signalements');
const adminCommentsRoutes = require('./admin-comments');
const imagesRoutes = require('./images');
// const userRoutes = require('./users');

const initRoutes = (app) => {
    app.use('/', authRoutes);
    app.use('/home', (req, res, next) => {
        res.status(200).json({
            message: 'Hello world !'
        });
    });
    app.use('/annonces', annoncesRoutes);
    app.use('/categories', categoriesRoutes);
    app.use('/signalements', signalementsRoutes);
    app.use('/admin-comments', adminCommentsRoutes);
    app.use('/images', imagesRoutes);
    // app.use(userRoutes);
}

module.exports = initRoutes;