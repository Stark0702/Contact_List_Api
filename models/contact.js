const mongoose = require('mongoose');

const phoneNumberSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true
  }
});

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumbers: [phoneNumberSchema],
  imageUrl: String,
  imageFile: {
    data: Buffer,
    contentType: String,
  },
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
