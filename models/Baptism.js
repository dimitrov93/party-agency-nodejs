const mongoose = require('mongoose');

const BaptismSchema = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Baptism = mongoose.model('Baptism', BaptismSchema);

module.exports = Baptism;
