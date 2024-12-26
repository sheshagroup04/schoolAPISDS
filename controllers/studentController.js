const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

exports.studentLogin = async (req, res) => {
  try {
    const { id, password } = req.body;

    // Validate input
    if (!id || !password) {
      return res.status(400).json({ message: "ID and password are required" });
    }

    // Find student by ID
    const student = await Student.findOne({ id });
    if (!student) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password with the hashed password in the database
    const isPasswordCorrect = await student.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: student.id, role: "student" }, // Include role in token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      token,
      message: "Login successful",
      student: {
        id: student.id,
        name: student.name,
        class: student.class,
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};