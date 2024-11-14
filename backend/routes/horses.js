const express = require('express');
const router = express.Router();
const horseCtrl = require('../controleur/horseCtrl');
const auth = require('../middleware/auth');

// Routes pour les chevaux
router.post('/', auth, horseCtrl.addHorse);
router.get('/', auth, horseCtrl.getAllHorses);
router.get('/:id', auth, horseCtrl.getHorseById);
router.put('/:id', auth, horseCtrl.updateHorse);
router.delete('/:id', auth, horseCtrl.deleteHorse);

module.exports = router;
