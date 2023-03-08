const mongoose = require('mongoose');

const WeddingSchema = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Wedding = mongoose.model('Wedding', WeddingSchema);

module.exports = Wedding;
