const Dpp = require("../models/DPP");
const fs = require("fs");
const path = require("path");

exports.uploadDpp = async (req, res) => {
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

    const dpp = new Dpp({
      fileName, // Save the fileName provided by the teacher
      filePath,
      className,
    });

    await dpp.save();

    res.status(201).json({
      message: "DPP uploaded successfully",
      dpp,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update DPP
exports.updateDpp = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, className } = req.body;

    const dpp = await Dpp.findById(id);
    if (!dpp) {
      return res.status(404).json({ message: "DPP not found" });
    }

    if (req.file) {
      // Delete the old file if it exists
      if (fs.existsSync(dpp.filePath)) {
        fs.unlinkSync(dpp.filePath);
      }

      // Save only the relative file path in the database
      const newFilePath = `uploads/pdfs/${req.file.filename}`;
      dpp.filePath = newFilePath;
      dpp.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (fileName) dpp.fileName = fileName;
    if (className) dpp.className = className;

    await dpp.save();

    res.status(200).json({ message: "DPP updated successfully", dpp });
  } catch (error) {
    console.error("Update DPP Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete DPP
exports.deleteDpp = async (req, res) => {
  try {
    const { id } = req.params;

    const dpp = await Dpp.findById(id);
    if (!dpp) {
      return res.status(404).json({ message: "DPP not found" });
    }

    // Delete the file from the filesystem
    const filePath = dpp.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Dpp.findByIdAndDelete(id);

    res.status(200).json({ message: "DPP deleted successfully" });
  } catch (error) {
    console.error("Delete DPP Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all DPPs by class
exports.getAllDppsByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const dpps = await Dpp.find({ className });

    if (dpps.length === 0) {
      return res.status(404).json({ message: "No DPPs found for this class" });
    }

    // Construct the full file path with the base URL for each DPP entry
    const baseURL = `${req.protocol}://${req.get("host")}${process.env.API}`;
    const dppsWithFullURLs = dpps.map(dpp => ({
      ...dpp.toObject(),
      filePath: `${baseURL}/${dpp.filePath}`
    }));

    res.status(200).json({ dpps: dppsWithFullURLs });
  } catch (error) {
    console.error("Get DPPs Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Serve DPP file with full URL
exports.getDppFile = async (req, res) => {
  try {
    const { id } = req.params;

    const dpp = await Dpp.findById(id);
    if (!dpp) {
      return res.status(404).json({ message: "DPP not found" });
    }

    const filePath = path.join(__dirname, '..', dpp.filePath);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Get DPP File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
