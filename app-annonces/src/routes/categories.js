const express = require('express');
const router = express.Router();
const { listCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../services/categories');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

router.get('/', listCategories);
router.get('/:id', getCategoryById);
router.post('/', validateAuthentication, isAdmin, createCategory);
router.put('/:id', validateAuthentication, isAdmin, updateCategory);
router.delete('/:id', validateAuthentication, isAdmin, deleteCategory);

module.exports = router;
