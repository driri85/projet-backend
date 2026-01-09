const express = require('express');
const router = express.Router();
const { validateAnnonce } = require('../middlewares/annonces');
const { validateAuthentication } = require('../middlewares/auth');
const { isAdmin } = require('../middlewares/users');

const { deleteAnnonceHttp, getAnnonceByIdHttp, createAnnonceHttp, searchAnnonce, updateAnnonceHttp, multiplicate } = require('../services/annonces');

router.get('/', searchAnnonce);

router.get('/all', validateAuthentication, isAdmin, (req, res, next) => {
    res.status(200).send();
});

router.get('/:id', getAnnonceByIdHttp);

router.post('/multiplicate', multiplicate);

router.post('/', validateAuthentication, isAdmin, validateAnnonce, createAnnonceHttp);

router.put('/:id', validateAuthentication, isAdmin, updateAnnonceHttp);

router.delete('/:id', validateAuthentication, isAdmin, deleteAnnonceHttp);

module.exports = router;