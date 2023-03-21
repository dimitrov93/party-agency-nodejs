const mongoose = require('mongoose');

const Cards = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Card = mongoose.model('Card', Cards);

module.exports = Card;
