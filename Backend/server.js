require("dotenv").config();
const studentRoutes = require('./routes/studentRoutes');
const express = require("express");
const cors = require("cors");
const { sequelize, connectDB } = require("./config/db");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const issuerRoutes = require('./routes/issuerRoutes');
const app = express();
const publicRoutes = require('./routes/publicRoutes');
connectDB();
const employerRoutes = require('./routes/employerRoutes');
const matchRoutes = require('./routes/matchRoutes');
const teamRoutes = require('./routes/teamRoutes');

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/issuer', issuerRoutes);
app.use('/api/employer', employerRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/team', teamRoutes);

app.get("/", (req, res) => {
  res.send("SkillProof backend is running 🚀");
});
const Internship = require('./models/Internship');
const InternshipSkill = require('./models/InternshipSkill');
const Project = require('./models/Project');
const Role = require('./models/Role');
const RoleSkill = require('./models/RoleSkill');
sequelize.sync({ alter: true }).then(() => {
  console.log("✅ Models synced with MySQL");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
const Skill = require("./models/Skill");
const Student = require("./models/Student");
const StudentSkill = require("./models/StudentSkill");

