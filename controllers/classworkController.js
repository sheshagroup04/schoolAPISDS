const Classwork = require("../models/Classwork");
const fs = require("fs");
const path = require("path");

exports.uploadClasswork = async (req, res) => {
  try {
    const { className, fileName } = req.body; // Get fileName from the request body
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    // Save only the relative path in the database
    const filePath = `uploads/pdfs/${file.filename}`;

    const classwork = new Classwork({
      fileName, // Save the fileName provided by the teacher
      filePath,
      className,
    });

    await classwork.save();

    res.status(201).json({
      message: "Classwork uploaded successfully",
      classwork,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update classwork
exports.updateClasswork = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, className } = req.body;

    const classwork = await Classwork.findById(id);
    if (!classwork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    if (req.file) {
      // Delete the old file if it exists
      if (fs.existsSync(classwork.filePath)) {
        fs.unlinkSync(classwork.filePath);
      }

      // Save only the relative file path in the database
      const newFilePath = `uploads/pdfs/${req.file.filename}`;
      classwork.filePath = newFilePath;
      classwork.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (fileName) classwork.fileName = fileName;
    if (className) classwork.className = className;

    await classwork.save();

    res.status(200).json({ message: "Classwork updated successfully", classwork });
  } catch (error) {
    console.error("Update Classwork Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete classwork
exports.deleteClasswork = async (req, res) => {
  try {
    const { id } = req.params;

    const classwork = await Classwork.findById(id);
    if (!classwork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    // Delete the file from the filesystem
    const filePath = classwork.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Classwork.findByIdAndDelete(id);

    res.status(200).json({ message: "Classwork deleted successfully" });
  } catch (error) {
    console.error("Delete Classwork Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all classwork by class
exports.getAllClassworkByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const classworks = await Classwork.find({ className });

    if (classworks.length === 0) {
      return res.status(404).json({ message: "No classwork found for this class" });
    }

    // Construct the full file path with the base URL for each classwork entry
    const baseURL = `${req.protocol}://${req.get("host")}${process.env.API}`;
    const classworksWithFullURLs = classworks.map(classwork => ({
      ...classwork.toObject(),
      filePath: `${baseURL}/${classwork.filePath}`
    }));

    res.status(200).json({ classworks: classworksWithFullURLs });
  } catch (error) {
    console.error("Get Classwork Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Serve classwork file with full URL
exports.getClassworkFile = async (req, res) => {
  try {
    const { id } = req.params;

    const classwork = await Classwork.findById(id);
    if (!classwork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    const filePath = path.join(__dirname, '..', classwork.filePath);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Get Classwork File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
