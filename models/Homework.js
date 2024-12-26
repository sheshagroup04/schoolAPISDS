const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  className: { type: String, required: true }, // Class associated with the homework
});

module.exports = mongoose.model("Homework", HomeworkSchema);
