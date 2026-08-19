const Student = require('../models/Student');
const Skill = require('../models/Skill');

// Calculates how well one student covers one role's required skills
async function calculateRoleMatch(studentId, skillNames) {
  const student = await Student.findByPk(studentId, {
    include: [{ model: Skill, through: { where: { status: 'verified' }, attributes: ['status'] } }],
  });
  if (!student) return null;

  const studentSkillNames = student.Skills.map(s => s.name.toLowerCase());
  const lowerRoleSkills = skillNames.map(s => s.toLowerCase());

  const matchedSkills = lowerRoleSkills.filter(s => studentSkillNames.includes(s));
  const matchPercent = lowerRoleSkills.length
    ? Math.round((matchedSkills.length / lowerRoleSkills.length) * 100)
    : 0;

  return {
    studentId: student.id,
    studentName: student.name,
    matchPercent,
    matchedCount: matchedSkills.length,
    totalRequired: lowerRoleSkills.length,
  };
}

module.exports = { calculateRoleMatch };