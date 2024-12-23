const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  horses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Horse',
      required: true,
    },
  ],
  starts_on: {
    type: Date,
    required: true,
  },
  ends_on: {
    type: Date,
    required: true,
  },
  customer_name: {
    type: String,
    required: true,
  },
  customer_email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Veuillez entrer un email valide'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au modèle User
    required: true, // Ce champ est maintenant requis
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
