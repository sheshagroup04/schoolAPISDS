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

  // Middleware to authenticate JWT token

  const verifyAccessToken = (req, res, next) => {
    try {
      // Check if the Authorization header is present
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access token is required" });
      }
  
      // Extract the token from the Authorization header
      const token = authHeader.split(" ")[1];
  
      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
  
        // Attach decoded token data to the request
        req.user = decoded; // Example: { id: "userId", role: "userRole", iat: ..., exp: ... }
        next();
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
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

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Only admins can perform this action." });
  }
  next();
};

module.exports = { authenticate, verifyAccessToken, isTeacher, isStudent, isAdmin };