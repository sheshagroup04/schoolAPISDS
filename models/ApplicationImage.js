const mongoose = require("mongoose");

const ApplicationImageSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  className: { type: String, required: true },
  imagePath: { type: String, required: true },
  imageName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ApplicationImage", ApplicationImageSchema);
