const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const indexRoutes = require("./routes/index.routes");
const User = require("./models/User");
const authorizeFileAccess = require("./middleware/authMiddleware"); 

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware for JSON parsing and form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Serve uploaded files
app.use(process.env.API+"/uploads/pdfs", authorizeFileAccess, express.static(path.join(__dirname, "uploads/pdfs")));
app.use(process.env.API+"/uploads/images", express.static(path.join(__dirname, "uploads/images"))); 

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log("Connected to MongoDB");

        // Check if a default admin exists, create one if not
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            const defaultAdmin = new User({
                name: "Admin",
                email: process.env.DEFAULT_ADMIN_EMAIL,
                password: process.env.DEFAULT_ADMIN_PASSWORD,
                role: "admin",
            });

            await defaultAdmin.save();
            console.log("Default admin created");
        }
        else{
            console.log("Default admin Already Exist");
        }
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB:", error.message);
    });

// Use routes
app.use(process.env.API, indexRoutes);

// 404 Route
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message || "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
