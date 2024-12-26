const mongoose = require("mongoose");

const DppSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  className: { type: String, required: true }, // Class associated with the dpp
});

module.exports = mongoose.model("Dpp", DppSchema);
