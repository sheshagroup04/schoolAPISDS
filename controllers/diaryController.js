const Diary = require("../models/Diary");
const fs = require("fs");

// Helper to construct the full URL
const constructFileUrl = (req, filePath) => 
    `${req.protocol}://${req.get("host")}${process.env.API}${filePath}`;
  
// Get all Diary Images
exports.getAllDiaryImages = async (req, res) => {
    try {
      const diaryImages = await Diary.find();
  
      if (diaryImages.length === 0) {
        return res.status(404).json({ message: "No diary entries found" });
      }
  
      // Add full URL to each file path
      const updatedDiaryImages = diaryImages.map((entry) => ({
        ...entry.toObject(),
        filePath: constructFileUrl(req, entry.filePath),
      }));
  
      res.status(200).json({ diaryImages: updatedDiaryImages });
    } catch (error) {
      console.error("Get Diary Images Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };


// Get Diary by Class
exports.getDiaryByClass = async (req, res) => {
    try {
      const { className } = req.params;
  
      if (!className) {
        return res.status(400).json({ message: "Class name is required" });
      }
  
      const diaryImages = await Diary.find({ className });
  
      if (diaryImages.length === 0) {
        return res.status(404).json({ message: `No diary images found for class ${className}` });
      }
  
      // Add full URL to each file path
      const updatedDiaryImages = diaryImages.map((entry) => ({
        ...entry.toObject(),
        filePath: constructFileUrl(req, entry.filePath),
      }));
  
      res.status(200).json({ diaryImages: updatedDiaryImages });
    } catch (error) {
      console.error("Get Diary Images Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };

// Upload Diary Image
exports.uploadDiaryImage = async (req, res) => {
  try {
    const { className, title } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Construct the full file path with the base URL
    const filePath = `/uploads/diary/${file.filename}`;

    const diaryEntry = new Diary({
      fileName: file.originalname,
      filePath,
      className,
      title,
    });

    await diaryEntry.save();

    res.status(201).json({
      message: "Diary entry uploaded successfully",
      diaryEntry,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Diary Image
exports.updateDiaryImage = async (req, res) => {
  try {
    const { id } = req.params; // Diary entry ID
    const { title, className } = req.body;

    // Find the diary entry by ID
    const diaryEntry = await Diary.findById(id);
    if (!diaryEntry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    if (req.file) {
      // If a new image is uploaded, delete the old one
      if (fs.existsSync(diaryEntry.filePath)) {
        fs.unlinkSync(diaryEntry.filePath);
      }

      // Update filePath and fileName with the new file
      const newFilePath = `/uploads/diary/${req.file.filename}`;
      diaryEntry.filePath = newFilePath;
      diaryEntry.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (title) diaryEntry.title = title;
    if (className) diaryEntry.className = className;

    // Save the updated diary entry
    await diaryEntry.save();

    res.status(200).json({ message: "Diary entry updated successfully", diaryEntry });
  } catch (error) {
    console.error("Update Diary Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Diary Image
exports.deleteDiaryImage = async (req, res) => {
  try {
    const { id } = req.params;

    const diaryEntry = await Diary.findById(id);
    if (!diaryEntry) {
      return res.status(404).json({ message: "Diary entry not found" });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(diaryEntry.filePath);

    await Diary.findByIdAndDelete(id);

    res.status(200).json({ message: "Diary entry deleted successfully" });
  } catch (error) {
    console.error("Delete Diary Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
