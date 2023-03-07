const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
