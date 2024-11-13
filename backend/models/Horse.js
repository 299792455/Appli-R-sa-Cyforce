const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
  horseId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  socialSecurityNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Horse', horseSchema);
