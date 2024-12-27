const mongoose = require("mongoose");

const GlobalNoticePdfSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Global Notice Pdf", GlobalNoticePdfSchema);