const mongoose = require('mongoose');

const horseSchema = new mongoose.Schema({
  horseId: {
    type: String,
    required: false,
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
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence à l'utilisateur
    required: true,
  },
});

module.exports = mongoose.model('Horse', horseSchema);
