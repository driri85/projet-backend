const { dbInstance, ImageAnnonce } = require('../models');

const listByAnnonce = async (req, res) => {
    const { annonceId } = req.params;
    const items = await ImageAnnonce.findAll({ where: { annonce_id: annonceId }, order: [['ordering', 'ASC']] });
    return res.status(200).json(items);
};

const addImage = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { annonce_id, url, ordering } = req.body;
        const img = await ImageAnnonce.create({ annonce_id, url, ordering }, { transaction: t });
        await t.commit();
        return res.status(201).json(img);
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error adding image', error });
    }
};

const deleteImage = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { id } = req.params;
        const deleted = await ImageAnnonce.destroy({ where: { id }, transaction: t });
        await t.commit();
        if (!deleted) return res.status(404).json({ message: 'Image not found' });
        return res.status(200).json({ message: 'Image deleted' });
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error deleting image', error });
    }
};

module.exports = {
    listByAnnonce,
    addImage,
    deleteImage
};
