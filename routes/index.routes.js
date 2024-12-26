const express = require("express");
const adminRoutes = require("./adminRoutes");
const teacherRoutes = require("./teacherRoutes");
const studentRoutes = require("./studentRoutes");

const router = express.Router();

// Admin routes
router.use("/admin", adminRoutes);

// Teacher routes
router.use("/teacher", teacherRoutes);

// Student routes
router.use("/student", studentRoutes);

module.exports = router;
