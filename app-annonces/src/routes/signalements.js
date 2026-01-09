const express = require('express');
const router = express.Router();
const { createSignalement, listSignalements, updateSignalement } = require('../services/signalements');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

// Public endpoint to create a report on an annonce
router.post('/', createSignalement);

// Admin-only management
router.get('/', validateAuthentication, isAdmin, listSignalements);
router.patch('/:id', validateAuthentication, isAdmin, updateSignalement);

module.exports = router;
