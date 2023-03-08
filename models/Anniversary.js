const mongoose = require('mongoose');

const AnniversarySchema = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Anniversary = mongoose.model('Anniversary', AnniversarySchema);

module.exports = Anniversary;
