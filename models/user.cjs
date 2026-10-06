'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // A User owns no books. Session 10 decides what a user may do
      // from role alone -- see middleware/requireRole.js.
    }

    // Session 9: the whole of this method is yours -- model:generate does not
    // write it. res.json() calls it before writing the response, so the
    // password hash is deleted from every copy of a User that leaves the API.
    toJSON() {                                              // <-- you add
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }
  // model:generate wrote three bare lines here -- email: DataTypes.STRING,
  // and the same for password and role. Every line marked below is one you
  // add by hand afterwards; the CLI has no way to know which column should
  // be unique or required.
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,          // <-- you add
      unique: true,              // <-- you add
      validate: {                // <-- you add, both rules inside it
        notEmpty: { msg: 'email is required' },
        isEmail: { msg: 'email must look like an email address' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,          // <-- you add
      validate: { notEmpty: { msg: 'password is required' } }   // <-- you add
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,          // <-- you add
      defaultValue: 'member'     // <-- you add
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
