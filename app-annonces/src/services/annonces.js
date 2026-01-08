const { Op } = require('sequelize');
const { Annonce, dbInstance } = require('../models');
const { mailer } = require('../utils/mailer');
require('dotenv').config();

const getAnnonceById = async (req, res) => {
    const id = req.params.id;
    // const annonce = await Annonce.findByPk(id);
    const annonce = await Annonce.findOne({
        where: {
            id
        }
    });
    res.status(200).json(annonce);
}

const searchAnnonce = async (req, res) => {
    // IMPROVMENT : Ajouter de la pagination, ajouter le nombre de résultats de recherche.
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
}

const createAnnonce = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { title, description, price, filepath, status } = req.body;
        const annonce = await Annonce.create({
            title,
            description,
            price,
            filepath,
            status
        }, { transaction });

        // TODO: définition automatique de l'utilisateur auteur après l'authentification

        // notification de l'admin d'une nouvelle annonce publiée
        const info = await mailer(
            process.env.MAIL_ADMIN,
            'Nouvelle Annonce',
            'Email de confirmation - Une nouvelle annonce à été créer',
            '<html><h1>Email de confirmation</h1><br><p>Une nouvelle annonce à été créer.</p></html>'
        );
        console.log(info);

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
}

const updateAnnonce = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { title, description, price, filepath, status } = req.body;
        const { id } = req.params;
        const annonce = await Annonce.update({
            title,
            description,
            price,
            filepath,
            status
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
}

const deleteAnnonce = async (req, res) => {
    const transaction = await dbInstance.transaction();
    try {
        const { id } = req.params;
        const annonce = await Annonce.destroy({
            where: {
                id
            },
            transaction
        });

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
}

module.exports = {
    getAnnonceById,
    createAnnonce,
    searchAnnonce,
    updateAnnonce,
    deleteAnnonce
};
