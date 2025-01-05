const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const RefreshToken = require("../models/RefreshToken");
const Student = require("../models/Student");

// Generate Tokens
const generateTokens = async (student) => {
  const accessToken = jwt.sign(
    { id: student.id, role: "student" },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  const refreshToken = jwt.sign(
    { id: student.id, role: "student" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({ token: hashedRefreshToken, userId: student.id });

  return { accessToken, refreshToken };
};

// Login
exports.studentLogin = async (req, res) => {
  try {
    const { id, password } = req.body;

    if (!id || !password) {
      return res.status(400).json({ message: "ID and password are required" });
    }

    const student = await Student.findOne({ id });
    if (!student || !(await student.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokens = await generateTokens(student);
    res.status(200).json({
      message: "Login successful",
      ...tokens,
      student: { id: student.id, name: student.name, class: student.class },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};