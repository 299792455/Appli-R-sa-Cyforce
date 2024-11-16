// BookingForm.js
import React, { useState, useEffect } from 'react';
import { fetchHorses, createBooking } from '../services/bookingService';
import '../styles/BookingForm.scss';

function BookingForm() {
  const [horses, setHorses] = useState([]);
  const [selectedHorses, setSelectedHorses] = useState([]);
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
        // Gérer l'erreur, par exemple en affichant un message à l'utilisateur
      }
    };

    loadHorses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      horse: selectedHorses[0], // Si un seul cheval est sélectionné
      starts_on: new Date(startTime),
      ends_on: new Date(new Date(startTime).getTime() + 30 * 60000),
      customer_name: customerName,
      customer_email: customerEmail,
    };

    try {
      await createBooking(bookingData);
      alert('Créneau réservé avec succès !');
      // Réinitialiser le formulaire
      setSelectedHorses([]);
      setStartTime('');
      setCustomerName('');
      setCustomerEmail('');
    } catch (error) {
      alert('Erreur lors de la réservation.');
      console.error('Erreur lors de la réservation :', error);
    }
  };

  const handleHorseSelection = (horseId) => {
    setSelectedHorses([horseId]); // Permet de sélectionner un seul cheval
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Cheval :
        <select
          value={selectedHorses[0] || ''}
          onChange={(e) => handleHorseSelection(e.target.value)}
          required
        >
          <option value="" disabled>
            Sélectionnez un cheval
          </option>
          {horses.map((horse) => (
            <option key={horse._id} value={horse._id}>
              {horse.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date et Heure de début :
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </label>
      <label>
        Nom :
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </label>
      <label>
        Email :
        <input
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
      </label>
      <button type="submit">Réserver</button>
    </form>
  );
}

export default BookingForm;
