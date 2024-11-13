import React, { useState } from 'react';
import { bookItem } from '../services/bookingService';

function BookingForm() {
  const [formData, setFormData] = useState({
    item_code: '1', // A CREER SUR DOKOS IMPORTANT !!!!!!
    from_datetime: '',
    to_datetime: '',
    customer: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await bookItem(formData);
      alert('Réservation réussie !');
      // Réinitialiser le formulaire ou rediriger l'utilisateur
    } catch (error) {
      alert('Erreur lors de la réservation.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>De :</label>
        <input
          type="datetime-local"
          name="from_datetime"
          value={formData.from_datetime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>À :</label>
        <input
          type="datetime-local"
          name="to_datetime"
          value={formData.to_datetime}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Votre nom :</label>
        <input
          type="text"
          name="customer"
          value={formData.customer}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Réserver</button>
    </form>
  );
}

export default BookingForm;
