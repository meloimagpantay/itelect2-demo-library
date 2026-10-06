'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Session 8: each Book belongs to one Author
      Book.belongsTo(models.Author, { foreignKey: 'authorId' });
    }
  }
  Book.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'title is required' } }
    },
    publishedDate: DataTypes.DATE,
    available: DataTypes.BOOLEAN,
    authorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};