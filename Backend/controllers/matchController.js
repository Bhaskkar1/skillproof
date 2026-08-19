const { calculateMatch } = require('../utils/matchingEngine');
const Student = require('../models/Student');

const getMatchForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;

    const student = await Student.findOne({ where: { userId: req.user.id } });
    if (!student) {
      return res.status(404).json({ message: 'Create your profile first' });
    }

    const result = await calculateMatch(student.id, internshipId);
    if (!result) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// EMPLOYER-facing: see match scores for ALL students against one of their internships
const getCandidatesForInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const students = await Student.findAll();

    const results = [];
    for (const student of students) {
      const match = await calculateMatch(student.id, internshipId);
      if (match) results.push(match);
    }

    results.sort((a, b) => b.matchPercent - a.matchPercent);

    res.status(200).json({ candidates: results });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMatchForInternship, getCandidatesForInternship };