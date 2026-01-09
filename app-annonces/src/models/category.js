const { Model } = require('sequelize');

const Category = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(model) {
            this.hasMany(model.Annonce, {
                foreignKey: 'category_id',
                as: 'Annonces'
            });
        }
    }

    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Category'
    });

    return Category;
};

module.exports = Category;
