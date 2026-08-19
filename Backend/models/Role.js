const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Project = require('./Project');

const Role = sequelize.define('Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  roleName: { type: DataTypes.STRING, allowNull: false }, // e.g. "Backend Developer"
});

Role.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Role, { foreignKey: 'projectId' });

module.exports = Role;