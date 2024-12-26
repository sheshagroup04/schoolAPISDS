const Gallery = require("../models/SchoolGallery");
const fs = require("fs");
const path = require("path");

// Upload images to the gallery
exports.uploadGallery = async (req, res) => {
  try {
    const { title } = req.body;
    const files = req.files;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    if (files.length > 5) {
      return res.status(400).json({ message: "You can upload a maximum of 15 images at a time" });
    }

    const images = files.map((file) => ({
      url: `/uploads/images/${file.filename}`,
      originalName: file.originalname,
    }));

    const gallery = new Gallery({ title, images });
    await gallery.save();

    res.status(201).json({ message: "Gallery uploaded successfully", gallery });
  } catch (error) {
    console.error("Upload Gallery Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to fetch gallery data
exports.getGallery = async (req, res) => {
    try {
      const gallery = await Gallery.find(); // Fetch all gallery items
      const cleanedData = gallery.map(item => ({
        _id: item._id,
        title: item.title || null,
        images: item.images.map(image => ({
          url: `${req.protocol}://${req.get("host")}${process.env.API}${image.url}`,
          originalName: image.originalName,
          _id: image._id,
        })),
      }));
      res.status(200).json(cleanedData);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gallery data', error });
    }
  };
  

// Update a gallery
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const files = req.files;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    if (title) gallery.title = title;

    if (files && files.length > 0) {
      if (files.length > 15) {
        return res.status(400).json({ message: "You can upload a maximum of 15 images at a time" });
      }

      const newImages = files.map((file) => ({
        url: `/uploads/images/${file.filename}`,
        originalName: file.originalname,
      }));

      gallery.images.push(...newImages);
    }

    await gallery.save();
    res.status(200).json({ message: "Gallery updated successfully", gallery });
  } catch (error) {
    console.error("Update Gallery Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a gallery
exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    // Remove files from filesystem
    gallery.images.forEach((image) => {
      const filePath = path.resolve(`uploads/images/${path.basename(image.url)}`);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await gallery.deleteOne();
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    console.error("Delete Gallery Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
