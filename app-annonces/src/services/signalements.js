const { dbInstance, Signalement } = require('../models');

const createSignalement = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { annonce_id, email, message } = req.body;
        const sig = await Signalement.create({ annonce_id, email, message }, { transaction: t });
        await t.commit();
        return res.status(201).json(sig);
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error creating report', error });
    }
};

const listSignalements = async (req, res) => {
    const items = await Signalement.findAll({ order: [['createdAt', 'DESC']] });
    return res.status(200).json(items);
};

const updateSignalement = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { id } = req.params;
        const { status, response } = req.body;
        const admin_id = req.user?.id || null;
        const [updated] = await Signalement.update({ status, response, admin_id, processedAt: new Date() }, { where: { id }, transaction: t });
        await t.commit();
        if (!updated) return res.status(404).json({ message: 'Report not found' });
        const sig = await Signalement.findByPk(id);
        return res.status(200).json(sig);
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error updating report', error });
    }
};

module.exports = {
    createSignalement,
    listSignalements,
    updateSignalement
};
