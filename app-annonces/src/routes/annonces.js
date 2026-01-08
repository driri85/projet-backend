const express = require('express');
const router = express.Router();
const { validateAnnonce } = require('../middlewares/annonces');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

const { deleteAnnonce, getAnnonceById, createAnnonce, searchAnnonce, updateAnnonce } = require('../services/annonces');

router.get('/', searchAnnonce);

router.get('/all', (req, res, next) => {
    res.status(200).send();
});

router.get('/:id', getAnnonceById);

router.post('/', validateAuthentication, validateAnnonce, createAnnonce);

router.put('/:id', updateAnnonce);

router.delete('/:id', deleteAnnonce);

module.exports = router;