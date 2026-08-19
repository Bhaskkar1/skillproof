const StudentSkill = require('../models/StudentSkill');
const Student = require('../models/Student');
const Skill = require('../models/Skill');

// GET all pending skill verification requests (across all students)
const getPendingVerifications = async (req, res) => {
  try {
    const pending = await StudentSkill.findAll({
      where: { status: 'pending' },
      include: [
        { model: Student, attributes: ['id', 'name'] },
        { model: Skill, attributes: ['id', 'name', 'category'] },
      ],
    });

    res.status(200).json({ pending });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// VERIFY or REVOKE a specific StudentSkill entry
const updateVerificationStatus = async (req, res) => {
  try {
    const { studentSkillId } = req.params;
    const { status } = req.body; // expected: "verified" or "revoked"

    if (!['verified', 'revoked'].includes(status)) {
      return res.status(400).json({ message: 'Status must be "verified" or "revoked"' });
    }

    const studentSkill = await StudentSkill.findByPk(studentSkillId);
    if (!studentSkill) {
      return res.status(404).json({ message: 'Skill record not found' });
    }

    studentSkill.status = status;
    studentSkill.issuerId = req.user.id; // record which issuer made this decision
    await studentSkill.save();

    res.status(200).json({ message: `Skill ${status}`, studentSkill });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getPendingVerifications, updateVerificationStatus };