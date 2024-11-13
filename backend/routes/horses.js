const express = require('express');
const Horse = require('../models/Horse');

const router = express.Router();

// Route pour obtenir tous les chevaux
router.get('/', async (req, res) => {
  try {
    const horses = await Horse.find();
    res.json(horses);
  } catch (error) {
    console.error('Erreur lors de la récupération des chevaux :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des chevaux.', error: error.message });
  }
});

module.exports = router;
