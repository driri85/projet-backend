const express = require('express');
const router = express.Router();
const { createSignalement, listSignalements, updateSignalement } = require('../services/signalements');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

router.post('/', createSignalement);

router.get('/', validateAuthentication, isAdmin, listSignalements);
router.patch('/:id', validateAuthentication, isAdmin, updateSignalement);

module.exports = router;
