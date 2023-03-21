const mongoose = require('mongoose');

const Tables = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Table = mongoose.model('Table', Tables);

module.exports = Table;
