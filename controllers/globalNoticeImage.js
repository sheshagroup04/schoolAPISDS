const GlobalImage = require("../models/GlobalNoticeImage");
const fs = require("fs");

// Get All Global Images
exports.getAllGlobalImages = async (req, res) => {
    try {
      const globalImages = await GlobalImage.find();
  
      if (globalImages.length === 0) {
        return res.status(404).json({ message: "No global images found" });
      }
  
      // Prepend the base URL to the filePath
      const updatedGlobalImages = globalImages.map((image) => ({
        ...image._doc,
        filePath: `${req.protocol}://${req.get("host")}${process.env.API}${image.filePath}`,
      }));
  
      res.status(200).json({ globalImages: updatedGlobalImages });
    } catch (error) {
      console.error("Get Global Images Error:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

// Upload Global Image
exports.uploadGlobalImage = async (req, res) => {
  try {
    const { title } = req.body; // Only title for the global image
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // Construct the full file path with the base URL
    const filePath = `/uploads/images/${file.filename}`;

    const globalImage = new GlobalImage({
      fileName: file.originalname,
      filePath,
      title,
    });

    await globalImage.save();

    res.status(201).json({
      message: "Global image uploaded successfully",
      globalImage,
    });
  } catch (error) {
    console.error("Upload Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Global Image
exports.updateGlobalImage = async (req, res) => {
  try {
    const { id } = req.params; // Global image ID
    const { title } = req.body;

    // Find the global image by ID
    const globalImage = await GlobalImage.findById(id);
    if (!globalImage) {
      return res.status(404).json({ message: "Global image not found" });
    }

    if (req.file) {
      // If a new image is uploaded, delete the old one
      if (fs.existsSync(globalImage.filePath)) {
        fs.unlinkSync(globalImage.filePath);
      }

      // Update filePath and fileName with the new file
      const newFilePath = `/uploads/images/${req.file.filename}`;
      globalImage.filePath = newFilePath;
      globalImage.fileName = req.file.originalname;
    }

    // Update other fields if provided
    if (title) globalImage.title = title;

    // Save the updated global image
    await globalImage.save();

    res.status(200).json({ message: "Global image updated successfully", globalImage });
  } catch (error) {
    console.error("Update Global Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Global Image
exports.deleteGlobalImage = async (req, res) => {
  try {
    const { id } = req.params;

    const globalImage = await GlobalImage.findById(id);
    if (!globalImage) {
      return res.status(404).json({ message: "Global image not found" });
    }

    // Delete the file from the filesystem
    fs.unlinkSync(globalImage.filePath);

    await GlobalImage.findByIdAndDelete(id);

    res.status(200).json({ message: "Global image deleted successfully" });
  } catch (error) {
    console.error("Delete Global Image Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
