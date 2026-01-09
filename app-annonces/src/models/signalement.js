const { Model } = require('sequelize');

const Signalement = (sequelize, DataTypes) => {
    class Signalement extends Model {
        static associate(model) {
            this.belongsTo(model.Annonce, {
                foreignKey: 'annonce_id',
                as: 'Annonce'
            });
            this.belongsTo(model.User, {
                foreignKey: 'admin_id',
                as: 'Admin'
            });
        }
    }

    Signalement.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM,
            values: ['new', 'in-progress', 'processed', 'rejected'],
            defaultValue: 'new'
        },
        response: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        processedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'Signalement'
    });

    return Signalement;
};

module.exports = Signalement;
