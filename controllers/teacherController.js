const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher"); // Teacher model
const Student = require("../models/Student"); // Student model
const RefreshToken = require("../models/RefreshToken");
const Teacher = require("../models/Teacher");

// Generate Tokens
const generateTokens = async (teacher) => {
  const accessToken = jwt.sign(
    { id: teacher.id, role: "teacher" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { id: teacher.id, role: "teacher" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({ token: hashedRefreshToken, userId: teacher.id });

  return { accessToken, refreshToken };
};

// Login
exports.teacherLogin = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ message: "ID and password are required" });
    }

    const teacher = await Teacher.findOne({ id });
    if (!teacher || !(await teacher.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = await generateTokens(teacher);
    res.status(200).json({
      message: "Login successful",
      ...tokens,
      teacher: { id: teacher.id, name: teacher.name, class: teacher.class },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Create a new student
exports.createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    const student = new Student(studentData);
    await student.save();
    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all students of a specific class
exports.getAllStudents = async (req, res) => {
  try {
    const { className } = req.params;
    const students = await Student.find({ class: className });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update student details
exports.updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;
    const student = await Student.findOneAndUpdate({ id: studentId }, updateData, { new: true });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOneAndDelete({ id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
