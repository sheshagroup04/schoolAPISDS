const mongoose = require("mongoose");

const ApplicationTextSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  className: { type: String, required: true },
  applicationText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Application Text", ApplicationTextSchema);
