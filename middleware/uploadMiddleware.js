const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/pdfs"); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext).replace(/\s+/g, "_"); // Remove spaces
    cb(null, `${fileName}-${timestamp}${ext}`);
  },
});

// File filter to allow only PDF uploads
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter
});

module.exports = upload;
