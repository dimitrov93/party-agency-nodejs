const mongoose = require('mongoose');

const PromSchema = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Prom = mongoose.model('Prom', PromSchema);

module.exports = Prom;
