const Booking = require('../models/Booking');
const Horse = require('../models/Horse');

// Créer une réservation
exports.createBooking = async (req, res) => {
  try {
    const { horse, starts_on, ends_on, customer_name, customer_email } = req.body;

    if (!horse || !starts_on || !ends_on || !customer_name || !customer_email) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires." });
    }

    const existingHorse = await Horse.findById(horse);
    if (!existingHorse) {
      return res.status(404).json({ message: "Cheval non trouvé." });
    }

    const overlappingBooking = await Booking.findOne({
      horse,
      $or: [
        { starts_on: { $lt: ends_on }, ends_on: { $gt: starts_on } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: "Ce créneau est déjà réservé pour ce cheval." });
    }

    const newBooking = new Booking({
      horse,
      starts_on,
      ends_on,
      customer_name,
      customer_email,
      userId: req.auth.userId, // Associer la réservation à l'utilisateur connecté
    });

    await newBooking.save();
    res.status(201).json({ message: "Réservation réussie.", data: newBooking });
  } catch (error) {
    console.error("Erreur lors de la réservation :", error);
    res.status(500).json({ message: "Erreur lors de la réservation.", error: error.message });
  }
};

// Récupérer toutes les réservations
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('horse')
      .select('horse starts_on ends_on userId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des réservations.', error: error.message });
  }
};

// Récupérer une réservation par ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('horse');
    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la réservation.', error: error.message });
  }
};

// Mettre à jour une réservation
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }
    res.status(200).json({ message: 'Réservation mise à jour !', data: updatedBooking });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation.', error: error.message });
  }
};

// Annuler une réservation (DELETE /:id)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Vérifier si l'utilisateur est le propriétaire de la réservation
    if (booking.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette réservation." });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Réservation supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la réservation.' });
  }
};

// Route pour réserver un item (alternative à createBooking)
exports.bookItem = async (req, res) => {
  try {
    const { horse_id, from_datetime, to_datetime, customer, customerEmail } = req.body;

    // Validation des données
    if (!horse_id || !from_datetime || !to_datetime || !customer || !customerEmail) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Validation des dates
    const starts_on = new Date(from_datetime);
    const ends_on = new Date(to_datetime);

    if (isNaN(starts_on) || isNaN(ends_on)) {
      return res.status(400).json({ message: 'Dates invalides.' });
    }

    if (starts_on >= ends_on) {
      return res.status(400).json({ message: 'La date de début doit être antérieure à la date de fin.' });
    }

    // Vérifier que le cheval existe
    const horse = await Horse.findById(horse_id);
    if (!horse) {
      return res.status(404).json({ message: 'Cheval non trouvé.' });
    }

    // Vérifier la disponibilité
    const overlappingBooking = await Booking.findOne({
      horse: horse_id,
      $or: [
        { starts_on: { $lt: ends_on }, ends_on: { $gt: starts_on } },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Ce créneau est déjà réservé pour ce cheval.' });
    }

    // Créer la réservation
    const newBooking = new Booking({
      horse: horse_id,
      starts_on,
      ends_on,
      customer_name: customer,
      customer_email: customerEmail,
      userId: req.auth.userId, // Associer la réservation à l'utilisateur connecté
    });

    await newBooking.save();

    // Nodemailer désactivé

    res.status(201).json({ message: 'Réservation réussie.', data: newBooking });
  } catch (error) {
    console.error('Erreur lors de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la réservation.', error: error.message });
  }
};

// Récupérer les créneaux disponibles
exports.getAvailableSlots = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // Une semaine par défaut

    const bookings = await Booking.find({
      starts_on: { $gte: start },
      ends_on: { $lte: end },
    })
      .populate('horse')
      .select('horse starts_on ends_on customer_name userId');

    const bookedSlots = bookings.map((booking) => ({
      id: booking._id,
      horse: {
        id: booking.horse._id,
        horseId: booking.horse.horseId,
        name: booking.horse.name,
        breed: booking.horse.breed,
        socialSecurityNumber: booking.horse.socialSecurityNumber,
      },
      from_datetime: booking.starts_on,
      to_datetime: booking.ends_on,
      customer: booking.customer_name,
      userId: booking.userId, // Inclure l'ID utilisateur
    }));

    res.json(bookedSlots);
  } catch (error) {
    console.error('Erreur lors de la récupération des créneaux :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des créneaux.', error: error.message });
  }
};

// Supprimer une réservation via book_item/:id (DELETE /book_item/:id)
exports.deleteBookItem = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Réservation non trouvée.' });
    }

    // Vérifier si l'utilisateur est le propriétaire de la réservation
    if (booking.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à supprimer cette réservation." });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Réservation supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réservation :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression de la réservation.' });
  }
};
