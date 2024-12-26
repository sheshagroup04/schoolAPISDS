const Student = require("../models/Student");

// Create a new student
exports.createStudent = async (studentData) => {
    const student = new Student(studentData); // studentData includes the password
    await student.save(); // This will trigger the pre-save hook and hash the password
    return student;
  };

// Get all students in a class
exports.getAllStudents = async (className) => {
  const students = await Student.find({ class: className });
  return students;
};

// Get student by ID
exports.getStudentById = async (studentId) => {
  const student = await Student.findOne({ id: studentId });
  return student;
};

// Update student details
exports.updateStudent = async (studentId, updateData) => {
  const student = await Student.findOneAndUpdate({ id: studentId }, updateData, { new: true });
  return student;
};

// Delete student
exports.deleteStudent = async (studentId) => {
  const student = await Student.findOneAndDelete({ id: studentId });
  return student;
};
