const Homework = require("../models/Homework");
const fs = require("fs");
const path = require("path");

exports.uploadHomework = async (req, res) => {
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

    const homework = new Homework({
      fileName, // Save the fileName provided by the teacher
      filePath,
      className,
    });

    await homework.save();

    res.status(201).json({
      message: "Homework uploaded successfully",
      homework,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Update homework
exports.updateHomework = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, className } = req.body;

    const homework = await Homework.findById(id);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    if (req.file) {
      // Delete the old file if it exists
      if (fs.existsSync(homework.filePath)) {
        fs.unlinkSync(homework.filePath);
      }

      // Save only the relative file path in the database
      const newFilePath = `uploads/pdfs/${req.file.filename}`;
      homework.filePath = newFilePath;
      homework.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (fileName) homework.fileName = fileName;
    if (className) homework.className = className;

    await homework.save();

    res.status(200).json({ message: "Homework updated successfully", homework });
  } catch (error) {
    console.error("Update Homework Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete homework
exports.deleteHomework = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findById(id);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    // Delete the file from the filesystem
    const filePath = homework.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Homework.findByIdAndDelete(id);

    res.status(200).json({ message: "Homework deleted successfully" });
  } catch (error) {
    console.error("Delete Homework Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all homework by class
exports.getAllHomeworkByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const homeworks = await Homework.find({ className });

    if (homeworks.length === 0) {
      return res.status(404).json({ message: "No homework found for this class" });
    }

    // Construct the full file path with the base URL for each classwork entry
    const baseURL = `${req.protocol}://${req.get("host")}${process.env.API}`;
    const homeworksWithFullURLs = homeworks.map(homework => ({
      ...homework.toObject(),
      filePath: `${baseURL}/${homework.filePath}`
    }));

    res.status(200).json({ homeworks: homeworksWithFullURLs });
  } catch (error) {
    console.error("Get Homework Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Serve homework file with full URL
exports.getHomeworkFile = async (req, res) => {
  try {
    const { id } = req.params;

    const homework = await Homework.findById(id);
    if (!homework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    const filePath = path.join(__dirname, '..', classwork.filePath);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Get Homework File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
