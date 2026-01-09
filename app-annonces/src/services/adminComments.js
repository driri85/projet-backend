const { dbInstance, AdminComment } = require('../models');

const listByAnnonce = async (req, res) => {
    const { annonceId } = req.params;
    const items = await AdminComment.findAll({ where: { annonce_id: annonceId }, order: [['createdAt', 'DESC']] });
    return res.status(200).json(items);
};

const createAdminComment = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { annonce_id, comment } = req.body;
        const admin_id = req.user.id;
        const item = await AdminComment.create({ annonce_id, admin_id, comment }, { transaction: t });
        await t.commit();
        return res.status(201).json(item);
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error creating admin comment', error });
    }
};

module.exports = {
    listByAnnonce,
    createAdminComment
};
