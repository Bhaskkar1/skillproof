const Internship = require('../models/Internship');
const Skill = require('../models/Skill');
const InternshipSkill = require('../models/InternshipSkill');

// CREATE an internship with required + optional skills
// body: { title, description, requiredSkills: ["Java","Spring Boot"], optionalSkills: ["AWS"] }
const createInternship = async (req, res) => {
  try {
    const { title, description, requiredSkills = [], optionalSkills = [] } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const internship = await Internship.create({
      title,
      description,
      employerId: req.user.id,
    });

    const allSkills = [
      ...requiredSkills.map(name => ({ name, isRequired: true })),
      ...optionalSkills.map(name => ({ name, isRequired: false })),
    ];

    for (const s of allSkills) {
      const [skill] = await Skill.findOrCreate({ where: { name: s.name } });
      await InternshipSkill.create({
        internshipId: internship.id,
        skillId: skill.id,
        isRequired: s.isRequired,
      });
    }

    res.status(201).json({ message: 'Internship created', internship });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all internships posted by the logged-in employer
const getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll({
      where: { employerId: req.user.id },
      include: [{ model: Skill, through: { attributes: ['isRequired'] } }],
    });
    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all internships (public/student browsing view)
const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.findAll({
      include: [{ model: Skill, through: { attributes: ['isRequired'] } }],
    });
    res.status(200).json({ internships });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createInternship, getMyInternships, getAllInternships };