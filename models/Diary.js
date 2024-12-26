const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  className: { type: String, required: true }, // Class associated with the diary image
  title: { type: String, required: true }, // Title for the diary entry
});

module.exports = mongoose.model("Diary", DiarySchema);
