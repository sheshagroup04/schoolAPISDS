const mongoose = require("mongoose");

const NoticePdfSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  className: { type: String, required: true }, // Class associated with the noticePdf
});

module.exports = mongoose.model("NoticePdfwork", NoticePdfSchema);
