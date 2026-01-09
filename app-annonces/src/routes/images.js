const express = require('express');
const router = express.Router();
const { listByAnnonce, addImage, deleteImage } = require('../services/images');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

router.get('/:annonceId', listByAnnonce);
router.post('/', validateAuthentication, isAdmin, addImage);
router.delete('/:id', validateAuthentication, isAdmin, deleteImage);

module.exports = router;
