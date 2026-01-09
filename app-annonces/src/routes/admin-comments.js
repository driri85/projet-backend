const express = require('express');
const router = express.Router();
const { listByAnnonce, createAdminComment } = require('../services/adminComments');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

router.get('/:annonceId', validateAuthentication, isAdmin, listByAnnonce);
router.post('/', validateAuthentication, isAdmin, createAdminComment);

module.exports = router;
