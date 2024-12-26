const ApplicationImage = require("../models/ApplicationImage");
const fs = require("fs");

// Get all Application Images by Class
exports.getAllApplicationsByClass = async (req, res) => {
    try {
      const { className } = req.params;
  
      if (!className) {
        return res.status(400).json({ message: "Class name is required" });
      }
  
      const applications = await ApplicationImage.find({ className });
  
      if (applications.length === 0) {
        return res.status(404).json({ message: "No applications found for this class" });
      }
  
      // Prepend the base URL to the filePath
      const updatedApplications = applications.map((application) => ({
        ...application._doc,
        imagePath: `${req.protocol}://${req.get("host")}${process.env.API}${application.imagePath}`,
      }));
  
      res.status(200).json({ applications: updatedApplications });
    } catch (error) {
      console.error("Get Application Images Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Upload Application Image
exports.uploadApplicationImage = async (req, res) => {
  try {
    const { className, fileName, studentName } = req.body; // Optional manual file name
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    if (!fileName) {
      return res.status(400).json({ message: "Image name is required" });
    }

    if (!studentName) {
        return res.status(400).json({ message: "Student name is required" });
    }

    // Construct the full file path with the base URL
    const filePath = `/uploads/images/${file.filename}`;

    const application = new ApplicationImage({
      studentName: req.body.studentName,
      className,
      imagePath: filePath,
      imageName: fileName,
    });

    await application.save();

    res.status(201).json({
      message: "Application image uploaded successfully",
      application,
    });
  } catch (error) {
    console.error("Upload Application Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Application Image
exports.updateApplicationImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentName, className } = req.body;

    // Find the application by ID
    const application = await ApplicationImage.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (req.file) {
      // If a new file is uploaded, delete the old one
      const oldFilePath = `uploads/images/${application.imageName}`;
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Update filePath and imageName with the new file
      const newFilePath = `/uploads/images/${req.file.filename}`;
      application.imagePath = newFilePath;
      application.imageName = req.file.originalname;
    }

    // Update other fields if provided
    if (studentName) application.studentName = studentName;
    if (className) application.className = className;

    // Save the updated application document
    await application.save();

    res.status(200).json({ message: "Application image updated successfully", application });
  } catch (error) {
    console.error("Update Application Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Application Image
exports.deleteApplicationImage = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await ApplicationImage.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Delete the file from the filesystem
    const filePath = `uploads/images/${application.imageName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await ApplicationImage.findByIdAndDelete(id);

    res.status(200).json({ message: "Application image deleted successfully" });
  } catch (error) {
    console.error("Delete Application Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
