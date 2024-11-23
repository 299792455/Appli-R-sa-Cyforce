// BookingForm.js

import React, { useState } from "react";
import { createBooking } from "../services/bookingService";
import "../styles/BookingForm.scss";

function BookingForm({ start, end, onClose, onBookingCreated, horses }) {
  const [selectedHorse, setSelectedHorse] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      horse: selectedHorse,
      starts_on: start,
      ends_on: end,
      customer_name: customerName,
      customer_email: customerEmail,
    };

    try {
      await createBooking(bookingData);
      alert("Créneau réservé avec succès !");
      onBookingCreated(); // Appeler le callback pour mettre à jour les réservations
      onClose(); // Fermer la modale après réservation
    } catch (error) {
      alert("Erreur lors de la réservation.");
      console.error("Erreur lors de la réservation :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Cheval :
        <select
          value={selectedHorse}
          onChange={(e) => setSelectedHorse(e.target.value)}
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
