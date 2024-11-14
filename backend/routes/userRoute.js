const express = require('express');
const router = express.Router();
const userCtrl = require('../controleur/userCtrl'); // Vérifie que ce chemin est correct

// Routes pour l'inscription et la connexion
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;

