const { Model, DataTypes } = require('sequelize');

const Annonce = (sequelize, DataTypes) => {
    class Annonce extends Model {
        static associate(model) {
            this.belongsTo(model.User, {
                foreignKey: 'user_id',
                as: 'User'
            });
            this.belongsTo(model.Category, {
                foreignKey: 'category_id',
                as: 'Category'
            });
            this.hasMany(model.ImageAnnonce, {
                foreignKey: 'annonce_id',
                as: 'Images'
            });
            this.hasMany(model.AdminComment, {
                foreignKey: 'annonce_id',
                as: 'AdminComments'
            });
            this.hasMany(model.Signalement, {
                foreignKey: 'annonce_id',
                as: 'Signalements'
            });
        }
    }
    
    Annonce.init({
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.FLOAT,
        filepath: DataTypes.TEXT,
        status: {
            type: DataTypes.ENUM,
            values: ['draft', 'published', 'suspended'],
            defaultValue: 'draft'
        }
    }, {
        sequelize,
        modelName: 'Annonce'
    });

    return Annonce;
}

module.exports = Annonce;