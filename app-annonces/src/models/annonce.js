const { Model, DataTypes } = require('sequelize');

const Annonce = (sequelize, DataTypes) => {
    class Annonce extends Model {
        // implementation des jointures 
        static associate(model) {
            this.belongsTo(model.User, {
                foreignKey: 'user_id',
                as: 'User'
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