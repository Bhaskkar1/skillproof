const Student = require('../models/Student');
const Skill = require('../models/Skill');
const StudentSkill = require('../models/StudentSkill');

// CREATE student profile (called once, right after registering as a student)
const createProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const existing = await Student.findOne({ where: { userId: req.user.id } });
    if (existing) {
      return res.status(400).json({ message: 'Profile already exists for this user' });
    }

    const student = await Student.create({
      name,
      bio,
      userId: req.user.id, // comes from the JWT via authMiddleware
    });

    res.status(201).json({ message: 'Profile created', student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADD a skill to the logged-in student's passport
const addSkill = async (req, res) => {
  try {
    const { skillName, category, evidenceType, evidenceLink } = req.body;

    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      return res.status(404).json({ message: 'Create your profile first' });
    }

    // find the skill, or create it if it doesn't exist yet
    let [skill] = await Skill.findOrCreate({
      where: { name: skillName },
      defaults: { category },
    });

    // check if the student already added this skill
    const existingLink = await StudentSkill.findOne({
      where: { studentId: student.id, skillId: skill.id },
    });
    if (existingLink) {
      return res.status(400).json({ message: 'Skill already added' });
    }

    const studentSkill = await StudentSkill.create({
      studentId: student.id,
      skillId: skill.id,
      evidenceType,
      evidenceLink,
      status: 'pending', // starts unverified until an issuer verifies it
    });

    res.status(201).json({ message: 'Skill added, pending verification', studentSkill });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET the logged-in student's full passport (profile + all skills + status)
const getMyPassport = async (req, res) => {
  try {
    const student = await Student.findOne({
      where: { userId: req.user.id },
      include: [{ model: Skill, through: { attributes: ['status', 'evidenceType', 'evidenceLink'] } }],
    });

    if (!student) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ student });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createProfile, addSkill, getMyPassport };
