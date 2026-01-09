const { dbInstance, Category } = require('../models');

const listCategories = async (req, res) => {
    const categories = await Category.findAll();
    return res.status(200).json(categories);
};

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });
    return res.status(200).json(cat);
};

const createCategory = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { name, description, slug } = req.body;
        const exists = await Category.findOne({ where: { slug }, transaction: t });
        if (exists) {
            await t.rollback();
            return res.status(409).json({ message: 'Slug already exists' });
        }
        const cat = await Category.create({ name, description, slug }, { transaction: t });
        await t.commit();
        return res.status(201).json(cat);
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error creating category', error });
    }
};

const updateCategory = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { id } = req.params;
        const { name, description, slug } = req.body;
        const [updated] = await Category.update({ name, description, slug }, { where: { id }, transaction: t });
        await t.commit();
        if (!updated) return res.status(404).json({ message: 'Category not found' });
        const cat = await Category.findByPk(id);
        return res.status(200).json(cat);
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error updating category', error });
    }
};

const deleteCategory = async (req, res) => {
    const t = await dbInstance.transaction();
    try {
        const { id } = req.params;
        const deleted = await Category.destroy({ where: { id }, transaction: t });
        await t.commit();
        if (!deleted) return res.status(404).json({ message: 'Category not found' });
        return res.status(200).json({ message: 'Category deleted' });
    } catch (error) {
        await t.rollback();
        return res.status(400).json({ message: 'Error deleting category', error });
    }
};

module.exports = {
    listCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
