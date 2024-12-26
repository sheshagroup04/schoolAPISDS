const mongoose = require("mongoose");

const LibrarySchema = new mongoose.Schema({
    bookName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
    className: { type: String, required: true }, // Class associated with the library
});

module.exports = mongoose.model("Library", LibrarySchema);
