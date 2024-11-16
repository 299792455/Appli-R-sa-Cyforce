// user.js
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ajouté
  password: { type: String, required: true }, // Ajouté
  bio: { type: String },
  profileImage: { type: String }, // URL de l'image de profil
  socialLinks: [{ type: String }],
});

module.exports = mongoose.model('User', userSchema);
