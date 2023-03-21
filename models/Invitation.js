const mongoose = require('mongoose');

const Invitations = new mongoose.Schema({
  title: String,
  images: [{
    filename: String,
    contentType: String,
    data: Buffer
  }]
});

const Invitation = mongoose.model('Invitation', Invitations);

module.exports = Invitation;
