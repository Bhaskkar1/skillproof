const Student = require('../models/Student');
const Skill = require('../models/Skill');
const Internship = require('../models/Internship');

// Calculates match score between one student and one internship
async function calculateMatch(studentId, internshipId) {
  const student = await Student.findByPk(studentId, {
    include: [{ model: Skill, through: { where: { status: 'verified' }, attributes: ['status'] } }],
  });

  const internship = await Internship.findByPk(internshipId, {
    include: [{ model: Skill, through: { attributes: ['isRequired'] } }],
  });

  if (!student || !internship) return null;

  const studentSkillNames = student.Skills.map(s => s.name.toLowerCase());

  const requiredSkills = internship.Skills.filter(s => s.InternshipSkill.isRequired);
  const optionalSkills = internship.Skills.filter(s => !s.InternshipSkill.isRequired);

  // Weighting: required skills worth more than optional
  const REQUIRED_WEIGHT = 80 / (requiredSkills.length || 1);
  const OPTIONAL_WEIGHT = 20 / (optionalSkills.length || 1);

  let score = 0;
  const matched = [];
  const missing = [];

  requiredSkills.forEach(skill => {
    if (studentSkillNames.includes(skill.name.toLowerCase())) {
      score += REQUIRED_WEIGHT;
      matched.push({ name: skill.name, required: true });
    } else {
      missing.push({ name: skill.name, required: true });
    }
  });

  optionalSkills.forEach(skill => {
    if (studentSkillNames.includes(skill.name.toLowerCase())) {
      score += OPTIONAL_WEIGHT;
      matched.push({ name: skill.name, required: false });
    } else {
      missing.push({ name: skill.name, required: false });
    }
  });

  return {
    studentId: student.id,
    studentName: student.name,
    internshipId: internship.id,
    matchPercent: Math.round(score),
    matched,
    missing,
  };
}

module.exports = { calculateMatch };