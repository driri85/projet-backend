const { where } = require("sequelize");
const { dbInstance, User } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const register = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { firstname, lastname, profil_picture, phone_number, address, zip_code, city, username, password } = req.body;
        const hashedpassword = await bcrypt.hash(password,parseInt(process.env.SALT));
        const user = await User.create({
            firstname,
            lastname,
            username,
            profil_picture,
            phone_number,
            address,
            zip_code,
            city,
            password: hashedpassword
        }, { transaction });

        transaction.commit();
        return res.status(201).json({
            message: 'Utilisateur créer avec succès',
            user: user.clean()
        })
    } catch(error) {
        transaction.rollback();
        const errormsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error;
        return res.status(400).json({
            message: "Erreur lors de la création de l'utilisateur",
            error: errormsg
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({
            where: { username }
            // attributes: [ 'id', 'firstname', 'lastname', 'username', 'password' ]
        });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isValid = await bcrypt.compare(password, user.password);
        if(!isValid) return res.status(401).json({ message: 'Unauthorized !'});

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });

        user.token = token;
        user.save();

        return res.status(200).json({
            user: user.clean(),
            token
        })
    } catch(error) {
        return res.status(400).json({
            message: "Erreur lors de l'authentification"
        })
    }
}

const logout = async (req, res) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if(err) return res.status(403).json({ message: 'Wrong JWT token' });
        const user = await User.findOne({ where: { token } });
        if(!user) return res.status(401).json({ message: 'Session expired !' });
        user.token = null;
        user.save();
        res.status(200).json({ message: 'unlogged!'}).end();
    });
}

module.exports = {
    register,
    login,
    logout
}
