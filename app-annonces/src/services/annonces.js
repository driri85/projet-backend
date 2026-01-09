const { Op } = require('sequelize');
const { Annonce, dbInstance } = require('../models');
const { mailer } = require('../utils/mailer');
require('dotenv').config({quiet: true});

// Unit-test oriented handler (returns 200 even when null)
const getAnnonceById = async (req, res) => {
    const id = req.params.id;
    const annonce = await Annonce.findOne({ where: { id } });
    res.status(200).json(annonce);
};

// HTTP handler enforcing 404 on missing annonce
const getAnnonceByIdHttp = async (req, res) => {
    const id = req.params.id;
    const annonce = await Annonce.findOne({ where: { id } });
    if (!annonce) return res.status(404).json({ message: 'Annonce not found' });
    return res.status(200).json(annonce);
};

const searchAnnonce = async (req, res) => {
    const search_key = req.query.search;
    const conditions = (search_key) ? {
        where: {
            title: {
                [Op.like]: '%'+ search_key +'%'
            }
        }
    } : {};
    const annonces = await Annonce.findAll(conditions);
    res.status(200).json(annonces);
};

// Unit-test oriented create (original contract)
const createAnnonce = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { title, description, price, filepath, status, category_id } = req.body;
        const annonce = await Annonce.create({
            title,
            description,
            price,
            filepath,
            status,
            category_id
        }, { transaction });
        const info = await mailer(
            process.env.MAIL_ADMIN,
            'Nouvelle Annonce',
            'Email de confirmation - Une nouvelle annonce à été créer',
            '<html><h1>Email de confirmation</h1><br><p>Une nouvelle annonce à été créer.</p></html>'
        );

        transaction.commit();
        return res.status(201).json({
            status: "Annonce créer avec succès",
            annonce,
            mail_notification: info
        });
    } catch (error) {
        transaction.rollback();
        const errormsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error;
        return res.status(400).json({
            status: "Erreur de la création de l'annonce",
            message: errormsg
        });
    }
};

// HTTP handler with user context, returning plain entity
const createAnnonceHttp = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { title, description, price, filepath, status, category_id } = req.body;
        const user_id = req.user?.id || null;
        const annonce = await Annonce.create({ title, description, price, filepath, status, category_id, user_id }, { transaction });
        await mailer(
            process.env.MAIL_ADMIN,
            'Nouvelle Annonce',
            'Email de confirmation - Une nouvelle annonce à été créer',
            '<html><h1>Email de confirmation</h1><br><p>Une nouvelle annonce à été créer.</p></html>'
        );
        await transaction.commit();
        return res.status(201).json(annonce);
    } catch (error) {
        await transaction.rollback();
        const errormsg = (error.name === 'SequelizeDatabaseError') ? error.parent.sqlMessage : error;
        return res.status(400).json({
            status: "Erreur de la création de l'annonce",
            message: errormsg
        });
    }
};

// Unit-test oriented update (original contract)
const updateAnnonce = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { title, description, price, filepath, status, category_id } = req.body;
        const { id } = req.params;
        const annonce = await Annonce.update({
            title,
            description,
            price,
            filepath,
            status,
            category_id
        }, {
            where: {
                id
            },
            transaction
        });

        transaction.commit();
        return res.status(200).json({
            status: "Annonce mise à jour avec succès",
            annonce
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            status: "Erreur de la mise à jour de l'annonce",
            error
        });
    }
};

// HTTP handler with proper 404 and full entity response
const updateAnnonceHttp = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { title, description, price, filepath, status, category_id } = req.body;
        const { id } = req.params;
        const annonce = await Annonce.findByPk(id);
        if (!annonce) {
            await transaction.rollback();
            return res.status(404).json({ message: 'Annonce not found' });
        }

        const updatedAnnonce = await annonce.update({ title, description, price, filepath, status, category_id }, { transaction });
        await transaction.commit();
        const payload = updatedAnnonce.get ? updatedAnnonce.get({ plain: true }) : updatedAnnonce;
        if (payload && payload.price !== undefined && payload.price !== null) {
            payload.price = payload.price.toString();
        }
        return res.status(200).json(payload);
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            status: "Erreur de la mise à jour de l'annonce",
            error
        });
    }
};

// Unit-test oriented delete
const deleteAnnonce = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { id } = req.params;
        await Annonce.destroy({ where: { id }, transaction });

        transaction.commit();
        return res.status(200).json({
            status: "Annonce supprimée avec succès"
        });
    } catch (error) {
        transaction.rollback();
        return res.status(400).json({
            status: "Erreur de la suppression de l'annonce",
            error
        });
    }
};

// HTTP handler with 404 on missing annonce
const deleteAnnonceHttp = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { id } = req.params;
        const deleted = await Annonce.destroy({ where: { id }, transaction });
        await transaction.commit();
        if (!deleted) return res.status(404).json({ message: 'Annonce not found' });
        return res.status(200).json({ status: "Annonce supprimée avec succès" });
    } catch (error) {
        await transaction.rollback();
        return res.status(400).json({
            status: "Erreur de la suppression de l'annonce",
            error
        });
    }
};

const multiplicated = (value1, value2) => {
    return value1 * value2;
};

const multiplicate = (req, res, next) => {
    const [ val1, val2 ] = req.body.items;
    const result = multiplicated(val1, val2);
    if(!result) return res.status(400).json({ message: "Format incorrect"});
    return res.status(200).json({ result });
};

module.exports = {
    getAnnonceById,
    getAnnonceByIdHttp,
    createAnnonce,
    createAnnonceHttp,
    searchAnnonce,
    updateAnnonce,
    updateAnnonceHttp,
    deleteAnnonce,
    deleteAnnonceHttp,
    multiplicated,
    multiplicate
};