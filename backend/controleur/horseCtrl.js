const Horse = require('../models/Horse');

// Ajouter un cheval
exports.addHorse = async (req, res) => {
  try {
    const { horseId, name, breed, socialSecurityNumber } = req.body;

    if (!horseId || !name || !breed || !socialSecurityNumber) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Vérifier l'unicité
    const existingHorse = await Horse.findOne({ horseId });
    if (existingHorse) {
      return res.status(400).json({ message: 'Un cheval avec cet ID existe déjà.' });
    }

    const horse = new Horse({
      horseId,
      name,
      breed,
      socialSecurityNumber,
    });

    await horse.save();
    res.status(201).json({ message: 'Cheval ajouté avec succès !', data: horse });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du cheval :', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout du cheval.', error: error.message });
  }
};

// Récupérer tous les chevaux
exports.getAllHorses = async (req, res) => {
  try {
    const horses = await Horse.find();
    res.status(200).json(horses);
  } catch (error) {
    console.error('Erreur lors de la récupération des chevaux :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des chevaux.', error: error.message });
  }
};

// Récupérer un cheval par ID
exports.getHorseById = async (req, res) => {
  try {
    const horse = await Horse.findById(req.params.id);
    if (!horse) {
      return res.status(404).json({ message: 'Cheval non trouvé.' });
    }
    res.status(200).json(horse);
  } catch (error) {
    console.error('Erreur lors de la récupération du cheval :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du cheval.', error: error.message });
  }
};

// Mettre à jour un cheval
exports.updateHorse = async (req, res) => {
  try {
    const updatedHorse = await Horse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHorse) {
      return res.status(404).json({ message: 'Cheval non trouvé.' });
    }
    res.status(200).json({ message: 'Cheval mis à jour !', data: updatedHorse });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du cheval :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du cheval.', error: error.message });
  }
};

// Supprimer un cheval
exports.deleteHorse = async (req, res) => {
  try {
    const deletedHorse = await Horse.findByIdAndDelete(req.params.id);
    if (!deletedHorse) {
      return res.status(404).json({ message: 'Cheval non trouvé.' });
    }
    res.status(200).json({ message: 'Cheval supprimé !', data: deletedHorse });
  } catch (error) {
    console.error('Erreur lors de la suppression du cheval :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du cheval.', error: error.message });
  }
};
