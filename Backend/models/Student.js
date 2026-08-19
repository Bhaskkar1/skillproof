const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// A Student profile belongs to one User (the login account)
Student.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Student, { foreignKey: 'userId' });

module.exports = Student;