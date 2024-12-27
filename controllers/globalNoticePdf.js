const GlobalNoticePdf = require("../models/GlobalNoticePdf");
const fs = require("fs");
const path = require("path");

// Upload Global Notice PDF
exports.uploadNoticePdf = async (req, res) => {
  try {
    const { fileName } = req.body; // Get fileName from the request body
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    // Save the relative file path in the database
    const filePath = `uploads/pdfs/${file.filename}`;

    const noticePdf = new GlobalNoticePdf({
      fileName,
      filePath,
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

// Update Global Notice PDF
exports.updateNoticePdf = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;

    const noticePdf = await GlobalNoticePdf.findById(id);
    if (!noticePdf) {
      return res.status(404).json({ message: "Notice PDF not found" });
    }

    if (req.file) {
      // Delete the old file if it exists
      if (fs.existsSync(noticePdf.filePath)) {
        fs.unlinkSync(noticePdf.filePath);
      }

      // Save the new file path
      const newFilePath = `uploads/pdfs/${req.file.filename}`;
      noticePdf.filePath = newFilePath;
    }

    // Update the fileName if provided
    if (fileName) noticePdf.fileName = fileName;

    await noticePdf.save();

    res.status(200).json({ message: "Notice PDF updated successfully", noticePdf });
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Global Notice PDF
exports.deleteNoticePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const noticePdf = await GlobalNoticePdf.findById(id);
    if (!noticePdf) {
      return res.status(404).json({ message: "Notice PDF not found" });
    }

    // Delete the file from the filesystem
    if (fs.existsSync(noticePdf.filePath)) {
      fs.unlinkSync(noticePdf.filePath);
    }

    await GlobalNoticePdf.findByIdAndDelete(id);

    res.status(200).json({ message: "Notice PDF deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Global Notice PDFs
exports.getAllNoticePdfs = async (req, res) => {
  try {
    const noticePdfs = await GlobalNoticePdf.find();

    if (noticePdfs.length === 0) {
      return res.status(404).json({ message: "No notice PDFs found" });
    }

    // Construct the full file URL with the base URL
    const baseURL = `${req.protocol}://${req.get("host")}${process.env.API}`;
    const noticePdfsWithFullURLs = noticePdfs.map((item) => ({
      ...item.toObject(),
      filePath: `${baseURL}/uploads/pdfs/${path.basename(item.filePath)}`,
    }));

    res.status(200).json({ noticePdfs: noticePdfsWithFullURLs });
  } catch (error) {
    console.error("Get All Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Serve Individual Global Notice PDF by ID
exports.getNoticePdf = async (req, res) => {
  try {
    const { id } = req.params;

    const noticePdf = await GlobalNoticePdf.findById(id);
    if (!noticePdf) {
      return res.status(404).json({ message: "Notice PDF not found" });
    }

    const filePath = path.join(__dirname, "..", noticePdf.filePath);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Get PDF Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
