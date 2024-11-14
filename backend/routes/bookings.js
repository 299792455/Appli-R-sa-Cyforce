const express = require('express');
const router = express.Router();
const bookingCtrl = require('../controleur/bookingCtrl');
const auth = require('../middleware/auth');

// Routes pour les réservations
router.post('/', auth, bookingCtrl.createBooking);
router.get('/', auth, bookingCtrl.getAllBookings);
router.get('/:id', auth, bookingCtrl.getBookingById);
router.put('/:id', auth, bookingCtrl.updateBooking);
router.delete('/:id', auth, bookingCtrl.deleteBooking);

// Routes supplémentaires
router.post('/book_item', bookingCtrl.bookItem);
router.get('/available_slots', bookingCtrl.getAvailableSlots);
router.delete('/book_item/:id', bookingCtrl.deleteBookItem);

module.exports = router;
