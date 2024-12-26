const Application = require("../models/ApplicationText");

// Create Application
exports.createApplication = async (req, res) => {
  try {
    const { studentName, className, applicationText } = req.body;

    if (!studentName || !className || !applicationText) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const application = new Application({ studentName, className, applicationText });
    await application.save();

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (error) {
    console.error("Create Application Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Applications by Class
exports.getApplicationsByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const applications = await Application.find({ className });

    if (applications.length === 0) {
      return res.status(404).json({ message: `No applications found for class ${className}` });
    }

    res.status(200).json({ applications });
  } catch (error) {
    console.error("Get Applications Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Application Text
exports.updateApplicationText = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationText } = req.body;

    if (!applicationText) {
      return res.status(400).json({ message: "Application text is required" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.applicationText = applicationText; // Update the application text
    await application.save();

    res.status(200).json({ message: "Application updated successfully", application });
  } catch (error) {
    console.error("Update Application Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Application
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await Application.findByIdAndDelete(id);

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete Application Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
