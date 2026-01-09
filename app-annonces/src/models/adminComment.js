const { Model } = require('sequelize');

const AdminComment = (sequelize, DataTypes) => {
    class AdminComment extends Model {
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

    AdminComment.init({
        comment: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'AdminComment'
    });

    return AdminComment;
};

module.exports = AdminComment;
