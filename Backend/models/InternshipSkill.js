const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Internship = require('./Internship');
const Skill = require('./Skill');

const InternshipSkill = sequelize.define('InternshipSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  isRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Internship.belongsToMany(Skill, { through: InternshipSkill, foreignKey: 'internshipId' });
Skill.belongsToMany(Internship, { through: InternshipSkill, foreignKey: 'skillId' });

InternshipSkill.belongsTo(Internship, { foreignKey: 'internshipId' });
InternshipSkill.belongsTo(Skill, { foreignKey: 'skillId' });

module.exports = InternshipSkill;