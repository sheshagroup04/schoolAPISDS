const jwt = require("jsonwebtoken");

// Middleware to authenticate a user
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if the Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    // Extract the token
    const token = authHeader.split(" ")[1];

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user info to the request

        // Log the decoded user info for debugging
        console.log("Decoded Token:", req.user); // Added for debugging

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
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