const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

Internship.belongsTo(User, { as: 'employer', foreignKey: 'employerId' });
User.hasMany(Internship, { foreignKey: 'employerId' });

module.exports = Internship;