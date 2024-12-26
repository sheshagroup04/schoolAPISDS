const NoticePdf = require("../models/NoticePdf");
const fs = require("fs");
const path = require("path");

exports.uploadNoticePdf = async (req, res) => {
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

    const noticePdf = new NoticePdf({
      fileName, // Save the fileName provided by the teacher
      filePath,
      className,
    });

    await noticePdf.save();

    res.status(201).json({
      message: "Notice PDF uploaded successfully",
      noticePdf,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update notice PDF
exports.updateNoticePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName, className } = req.body;

    const noticePdf = await NoticePdf.findById(id);
    if (!noticePdf) {
      return res.status(404).json({ message: "Notice PDF not found" });
    }

    if (req.file) {
      // Delete the old file if it exists
      if (fs.existsSync(noticePdf.filePath)) {
        fs.unlinkSync(noticePdf.filePath);
      }

      // Save only the relative file path in the database
      const newFilePath = `uploads/pdfs/${req.file.filename}`;
      noticePdf.filePath = newFilePath;
      noticePdf.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (fileName) noticePdf.fileName = fileName;
    if (className) noticePdf.className = className;

    await noticePdf.save();

    res.status(200).json({ message: "Notice PDF updated successfully", noticePdf });
  } catch (error) {
    console.error("Update Notice PDF Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete notice PDF
exports.deleteNoticePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const noticePdf = await NoticePdf.findById(id);
    if (!noticePdf) {
      return res.status(404).json({ message: "Notice PDF not found" });
    }

    // Delete the file from the filesystem
    const filePath = noticePdf.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await NoticePdf.findByIdAndDelete(id);

    res.status(200).json({ message: "Notice PDF deleted successfully" });
  } catch (error) {
    console.error("Delete Notice PDF Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all notice PDFs by class
exports.getAllNoticePdfsByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const noticePdfs = await NoticePdf.find({ className });

    if (noticePdfs.length === 0) {
      return res.status(404).json({ message: "No notice PDFs found for this class" });
    }

    // Construct the full file path with the base URL for each notice PDF entry
    const baseURL = `${req.protocol}://${req.get("host")}${process.env.API}`;
    const noticePdfsWithFullURLs = noticePdfs.map(noticePdf => ({
      ...noticePdf.toObject(),
      filePath: `${baseURL}/${noticePdf.filePath}`
    }));

    res.status(200).json({ noticePdfs: noticePdfsWithFullURLs });
  } catch (error) {
    console.error("Get Notice PDFs Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Serve notice PDF file with full URL
exports.getNoticePdfFile = async (req, res) => {
  try {
    const { id } = req.params;

    const noticePdf = await NoticePdf.findById(id);
    if (!noticePdf) {
      return res.status(404).json({ message: "Notice PDF not found" });
    }

    const filePath = path.join(__dirname, '..', noticePdf.filePath);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Get Notice PDF File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
