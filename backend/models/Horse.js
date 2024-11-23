const mongoose = require('mongoose');
const path = require('path');

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
  imageURL: {
    type: String,
    default: path.join('images', 'logoMiniaCheval.png'), // URL par défaut
    required: false,
  },
});

module.exports = mongoose.model('Horse', horseSchema);

