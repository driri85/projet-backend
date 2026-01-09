const { Model } = require('sequelize');

const ImageAnnonce = (sequelize, DataTypes) => {
    class ImageAnnonce extends Model {
        static associate(model) {
            this.belongsTo(model.Annonce, {
                foreignKey: 'annonce_id',
                as: 'Annonce'
            });
        }
    }

    ImageAnnonce.init({
        url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ordering: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    }, {
        sequelize,
        modelName: 'ImageAnnonce'
    });

    return ImageAnnonce;
};

module.exports = ImageAnnonce;
