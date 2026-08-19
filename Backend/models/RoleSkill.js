const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Role = require('./Role');
const Skill = require('./Skill');

const RoleSkill = sequelize.define('RoleSkill', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

Role.belongsToMany(Skill, { through: RoleSkill, foreignKey: 'roleId' });
Skill.belongsToMany(Role, { through: RoleSkill, foreignKey: 'skillId' });

RoleSkill.belongsTo(Role, { foreignKey: 'roleId' });
RoleSkill.belongsTo(Skill, { foreignKey: 'skillId' });

module.exports = RoleSkill;