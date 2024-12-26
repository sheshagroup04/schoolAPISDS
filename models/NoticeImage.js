const mongoose = require("mongoose");

const NoticeImageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  className: { type: String, required: true }, // Class associated with the notice image
});

module.exports = mongoose.model("NoticeImage", NoticeImageSchema);
