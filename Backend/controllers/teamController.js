const Project = require('../models/Project');
const Role = require('../models/Role');
const RoleSkill = require('../models/RoleSkill');
const Skill = require('../models/Skill');
const Student = require('../models/Student');
const { calculateRoleMatch } = require('../utils/teamMatching');

// CREATE a project with roles + their required skills in one go
// body: { title, description, roles: [{ roleName, skills: [...] }, ...] }
const createProject = async (req, res) => {
  try {
    const { title, description, roles } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const project = await Project.create({ title, description, ownerId: req.user.id });

    if (Array.isArray(roles)) {
      for (const r of roles) {
        const role = await Role.create({ roleName: r.roleName, projectId: project.id });
        for (const skillName of (r.skills || [])) {
          const [skill] = await Skill.findOrCreate({ where: { name: skillName } });
          await RoleSkill.create({ roleId: role.id, skillId: skill.id });
        }
      }
    }

    res.status(201).json({ message: 'Project created', project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all projects the logged-in user created
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { ownerId: req.user.id } });
    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET recommended team: best-matching student per role, + overall coverage %
const getRecommendations = async (req, res) => {
  try {
    const { projectId } = req.params;

    const roles = await Role.findAll({
      where: { projectId },
      include: [{ model: Skill }],
    });

    if (roles.length === 0) {
      return res.status(404).json({ message: 'No roles defined for this project' });
    }

    const students = await Student.findAll();
    const teamRecommendation = [];
    let totalCoverage = 0;

    for (const role of roles) {
      const skillNames = role.Skills.map(s => s.name);

      const candidates = [];
      for (const student of students) {
        const match = await calculateRoleMatch(student.id, skillNames);
        if (match) candidates.push(match);
      }
      candidates.sort((a, b) => b.matchPercent - a.matchPercent);

      const best = candidates[0] || null;
      totalCoverage += best ? best.matchPercent : 0;

      teamRecommendation.push({
        roleName: role.roleName,
        requiredSkills: skillNames,
        recommended: best,
        allCandidates: candidates.slice(0, 3),
      });
    }

    const teamCoverage = Math.round(totalCoverage / roles.length);

    res.status(200).json({ teamCoverage, roles: teamRecommendation });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createProject, getMyProjects, getRecommendations };