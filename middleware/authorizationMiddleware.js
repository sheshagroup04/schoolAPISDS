// Middleware to check if the user is a teacher
const isTeacher = (req, res, next) => {
    const userRole = req.user?.role; // Assuming req.user contains the logged-in user's data
  
    if (userRole === "teacher") {
      next();
    } else {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
  };
  
  module.exports = { isTeacher };
  