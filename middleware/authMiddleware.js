const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path to your User model

const authorizeFileAccess = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. Token not provided." });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. Invalid token format." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user from the database using the ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Access denied. User not found." });
    }

    // Authorized roles
    const authorizedRoles = ["isStudent", "isTeacher"];
    if (!authorizedRoles.includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role." });
    }

    // Attach user details to the request object for further use if needed
    req.user = user;
    next();
  } catch (error) {
    console.error("Authorization Error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access denied. Token has expired." });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Access denied. Invalid token." });
    } else {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
};

module.exports = authorizeFileAccess;
