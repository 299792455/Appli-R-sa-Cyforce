const express = require('express');
const router = express.Router();
const userCtrl = require('../controleur/userCtrl');
const auth = require('../middleware/auth');

// Routes pour l'inscription, la connexion et la récupération des informations utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/me', auth, userCtrl.getUserInfo);

module.exports = router;
