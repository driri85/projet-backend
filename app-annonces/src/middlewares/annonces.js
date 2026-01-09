const { checkSchema } = require('express-validator');

const validateAnnonce = async (req, res, next) => {
    const [ validation ] = await checkSchema({
        title: { notEmpty: true }
    }).run(req);
    if(!validation.isEmpty()) {
        res.status(400).json({
            message: 'le champs title est manquant'
        });
    }
    next();
}

module.exports = {
    validateAnnonce
};