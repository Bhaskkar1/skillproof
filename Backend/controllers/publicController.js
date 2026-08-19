const QRCode = require('qrcode');
const Student = require('../models/Student');
const Skill = require('../models/Skill');
const StudentSkill = require('../models/StudentSkill');

// PUBLIC — anyone can view this, no login needed. Only shows VERIFIED skills.
const getPublicPassport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Skill,
          through: {
            where: { status: 'verified' }, // only pull skills that are verified
            attributes: ['status', 'evidenceType'],
          },
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      name: student.name,
      bio: student.bio,
      verifiedSkills: student.Skills, // only verified ones, thanks to the filter above
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Generate a QR code image (as base64) pointing to this student's public passport
const getPassportQR = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // This URL is what the QR code encodes — change domain later when deployed
    const passportUrl = `http://localhost:5000/api/public/passport/${studentId}`;

    const qrImage = await QRCode.toDataURL(passportUrl); // returns a base64 image string

    res.status(200).json({ passportUrl, qrImage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getPublicPassport, getPassportQR };