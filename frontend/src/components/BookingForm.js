import React, { useState, useEffect } from 'react';
import { fetchHorses, createBooking } from '../services/bookingService';

function BookingForm() {
  const [horses, setHorses] = useState([]);
  const [selectedHorse, setSelectedHorse] = useState('');
  const [startTime, setStartTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const loadHorses = async () => {
      try {
        const data = await fetchHorses();
        setHorses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des chevaux :', error);
      }
    };

    loadHorses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      horse: selectedHorse,
      starts_on: new Date(startTime),
      ends_on: new Date(new Date(startTime).getTime() + 30 * 60000), // Ajoute 30 minutes
      customer_name: customerName,
      customer_email: customerEmail,
    };

    try {
      await createBooking(bookingData);
      alert('Réservation réussie !');
      // Réinitialiser le formulaire
      setSelectedHorse('');
      setStartTime('');
      setCustomerName('');
      setCustomerEmail('');
    } catch (error) {
      alert('Erreur lors de la réservation.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Cheval:
        <select value={selectedHorse} onChange={(e) => setSelectedHorse(e.target.value)} required>
          <option value="">Sélectionnez un cheval</option>
          {horses.map((horse) => (
            <option key={horse._id} value={horse._id}>
              {horse.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Date et Heure de début:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Votre Nom:
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Votre Email:
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Réserver</button>
    </form>
  );
}

export default BookingForm;
