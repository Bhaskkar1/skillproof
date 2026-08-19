const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Student = require('./Student');
const Skill = require('./Skill');
const User = require('./User');

const StudentSkill = sequelize.define('StudentSkill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'revoked'),
    defaultValue: 'pending',
  },
  evidenceType: {
    type: DataTypes.STRING, // e.g. "coursework", "project", "certificate", "competition"
    allowNull: true,
  },
  evidenceLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Many-to-many: Student <-> Skill, through StudentSkill
Student.belongsToMany(Skill, { through: StudentSkill, foreignKey: 'studentId' });
Skill.belongsToMany(Student, { through: StudentSkill, foreignKey: 'skillId' });

// Track which issuer (User) verified this skill
StudentSkill.belongsTo(User, { as: 'issuer', foreignKey: 'issuerId' });
StudentSkill.belongsTo(Student, { foreignKey: 'studentId' });
StudentSkill.belongsTo(Skill, { foreignKey: 'skillId' });
module.exports = StudentSkill;
