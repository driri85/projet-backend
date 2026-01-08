const jwt = require('jsonwebtoken');
const { User } = require('../models');

const validateAuthentication = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if(err) return res.status(403).json({ message: 'Wrong JWT token' });
        const user = await User.findOne({ where: { token } });
        if (!user) return res.status(403).json({ message: 'Session expired' });
        req.user = user;
        next();
    })
};

module.exports = {
    validateAuthentication
}