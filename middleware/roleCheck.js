// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Only admins can perform this action." });
    }
    next();
};

module.exports = { isAdmin };
