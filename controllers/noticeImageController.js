const NoticeImage = require("../models/NoticeImage");
const fs = require("fs");

// Get all Notice Images
exports.getAllNoticeImages = async (req, res) => {
  try {
    const noticeImages = await NoticeImage.find();

    if (noticeImages.length === 0) {
      return res.status(404).json({ message: "No Notice Images found" });
    }

    // Prepend the base URL to the filePath
    const updatedNoticeImages = noticeImages.map((notice) => ({
      ...notice._doc,
      filePath: `${req.protocol}://${req.get("host")}${process.env.API}${notice.filePath}`,
    }));

    res.status(200).json({ noticeImages: updatedNoticeImages });
  } catch (error) {
    console.error("Get Notice Images Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Notice Images by Class
exports.getNoticeImagesByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const noticeImages = await NoticeImage.find({ className });

    if (noticeImages.length === 0) {
      return res.status(404).json({ message: `No Notice Images found for class ${className}` });
    }

    // Prepend the base URL to the filePath
    const updatedNoticeImages = noticeImages.map((notice) => ({
      ...notice._doc,
      filePath: `${req.protocol}://${req.get("host")}${process.env.API}${notice.filePath}`,
    }));

    res.status(200).json({ noticeImages: updatedNoticeImages });
  } catch (error) {
    console.error("Get Notice Images Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
  

// Upload Notice Image
exports.uploadNoticeImage = async (req, res) => {
  try {
    const { className, fileName } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    if (!fileName) {
      return res.status(400).json({ message: "File name is required" });
    }

    // Construct the full file path with the base URL
    const filePath = `/uploads/images/${file.filename}`;

    const noticeImage = new NoticeImage({
      fileName,
      filePath,
      className,
    });

    await noticeImage.save();

    res.status(201).json({
      message: "Notice Image uploaded successfully",
      noticeImage,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Notice Image
exports.updateNoticeImage = async (req, res) => {
  try {
    const { id } = req.params; // Notice Image ID
    const { fileName, className } = req.body;

    // Find the notice image by ID
    const noticeImage = await NoticeImage.findById(id);
    if (!noticeImage) {
      return res.status(404).json({ message: "Notice Image not found" });
    }

    if (req.file) {
      // If a new image is uploaded, delete the old one
      if (fs.existsSync(noticeImage.filePath)) {
        fs.unlinkSync(noticeImage.filePath);
      }

      // Update filePath and fileName with the new file
      const newFilePath = `${req.protocol}://${req.get("host")}${process.env.API}/uploads/images/${req.file.filename}`;
      noticeImage.filePath = newFilePath;
      noticeImage.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (fileName) noticeImage.fileName = fileName;
    if (className) noticeImage.className = className;

    // Save the updated notice image
    await noticeImage.save();

    res.status(200).json({ message: "Notice Image updated successfully", noticeImage });
  } catch (error) {
    console.error("Update Notice Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Notice Image
exports.deleteNoticeImage = async (req, res) => {
  try {
    const { id } = req.params;

    const noticeImage = await NoticeImage.findById(id);
    if (!noticeImage) {
      return res.status(404).json({ message: "Notice Image not found" });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(noticeImage.filePath);

    await NoticeImage.findByIdAndDelete(id);

    res.status(200).json({ message: "Notice Image deleted successfully" });
  } catch (error) {
    console.error("Delete Notice Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
