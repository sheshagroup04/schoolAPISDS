const mongoose = require("mongoose");

const globalNoticeImageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  title: { type: String, required: true },
}, { timestamps: true });

const GlobalImage = mongoose.model("GlobalNoticeImage", globalNoticeImageSchema);

module.exports = GlobalImage;