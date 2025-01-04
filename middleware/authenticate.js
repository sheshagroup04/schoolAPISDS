const jwt = require("jsonwebtoken");

// Middleware to authenticate API key
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey && apiKey === process.env.API_KEY) {
      return next();
    } else {
      return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }
  };

// Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
    const userRole = req.user?.role; // Assuming req.user contains the logged-in user's data

    // Log the user role for debugging
    console.log("User Role:", userRole); // Added for debugging

    if (userRole === "teacher") {
        next();
    } else {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
};

// Middleware to check if the user is a student
const isStudent = (req, res, next) => {
    const userRole = req.user?.role; // Assuming req.user contains the logged-in user's data

    // Log the user role for debugging
    console.log("User Role:", userRole); // Added for debugging

    if (userRole === "student") {
        next();
    } else {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
};

module.exports = { authenticate, isTeacher, isStudent };