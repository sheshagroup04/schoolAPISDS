const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  originalName: { type: String, required: true },
});

const gallerySchema = new mongoose.Schema({
  title: { type: String },
  images: [imageSchema], // Array of image objects
});

module.exports = mongoose.model('Gallery', gallerySchema);
