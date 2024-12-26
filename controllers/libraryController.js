const Library = require("../models/Library");
const fs = require("fs");
const path = require("path");

exports.uploadLibraryFile = async (req, res) => {
  try {
    const { className ,bookName } = req.body; // Get bookName from the request body
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!bookName) {
      return res.status(400).json({ message: "Book name is required" });
    }

    // Save only the relative path in the database
    const filePath = `uploads/pdfs/${file.filename}`;

    const libraryItem = new Library({
      className,
      bookName, // Save the bookName provided by the user
      filePath,
      uploadDate: new Date(),
    });

    await libraryItem.save();

    res.status(201).json({
      message: "Library file uploaded successfully",
      libraryItem,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Library file
exports.updateLibraryFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookName } = req.body;

    const libraryItem = await Library.findById(id);
    if (!libraryItem) {
      return res.status(404).json({ message: "Library item not found" });
    }

    if (req.file) {
      // Delete the old file if it exists
      if (fs.existsSync(libraryItem.filePath)) {
        fs.unlinkSync(libraryItem.filePath);
      }

      // Save only the relative file path in the database
      const newFilePath = `uploads/pdfs/${req.file.filename}`;
      libraryItem.filePath = newFilePath;
    }

    // Update other fields if provided
    if (bookName) libraryItem.bookName = bookName;

    await libraryItem.save();

    res.status(200).json({ message: "Library file updated successfully", libraryItem });
  } catch (error) {
    console.error("Update Library File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Library file
exports.deleteLibraryFile = async (req, res) => {
  try {
    const { id } = req.params;

    const libraryItem = await Library.findById(id);
    if (!libraryItem) {
      return res.status(404).json({ message: "Library item not found" });
    }

    // Delete the file from the filesystem
    const filePath = libraryItem.filePath;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Library.findByIdAndDelete(id);

    res.status(200).json({ message: "Library file deleted successfully" });
  } catch (error) {
    console.error("Delete Library File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all library items by class
exports.getAllLibraryByClass = async (req, res) => {
  try {
    const { className } = req.params;

    if (!className) {
      return res.status(400).json({ message: "Class name is required" });
    }

    const libraryItems = await Library.find({ className });

    if (libraryItems.length === 0) {
      return res.status(404).json({ message: "No library items found for this class" });
    }

    // Construct the full file path with the base URL for each library item
    const baseURL = `${req.protocol}://${req.get("host")}${process.env.API}`;
    const libraryItemsWithFullURLs = libraryItems.map(item => ({
      ...item.toObject(),
      filePath: `${baseURL}/uploads/pdfs/${item.filePath.split('/').pop()}`
    }));

    res.status(200).json({ libraryItems: libraryItemsWithFullURLs });
  } catch (error) {
    console.error("Get Library By Class Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

  

// Serve library file with full URL
exports.getLibraryFile = async (req, res) => {
  try {
    const { className } = req.params;

    const libraryItem = await Library.find({ className });
    if (!libraryItem) {
      return res.status(404).json({ message: "Library item not found" });
    }

    const filePath = path.join(__dirname, '..', libraryItem.filePath);
    res.status(200).sendFile(filePath);
  } catch (error) {
    console.error("Get Library File Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
