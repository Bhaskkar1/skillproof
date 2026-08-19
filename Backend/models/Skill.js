const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Skill = sequelize.define('Skill', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING, // e.g. "Backend", "Frontend", "AI/ML", "Design"
    allowNull: true,
  },
});

module.exports = Skill;