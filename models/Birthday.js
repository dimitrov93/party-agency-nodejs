const mongoose = require('mongoose');

const BirthdaySchema = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Birthday = mongoose.model('Birthday', BirthdaySchema);

module.exports = Birthday;
