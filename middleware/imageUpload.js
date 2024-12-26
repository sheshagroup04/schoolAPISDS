const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Upload directory for images
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}_${fileName}`);
  },
});

// File filter to allow all image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/svg+xml", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
