import React, { useState } from "react";
import { createBooking } from "../services/bookingService";
import "../styles/BookingForm.scss";

// Importer le composant nécessaire pour un menu déroulant multi-sélection
import Select from 'react-select';

function BookingForm({ start, end, onClose, onBookingCreated, horses }) {
  const [selectedHorses, setSelectedHorses] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  // Préparer les options pour react-select
  const horseOptions = horses.map((horse) => ({
    value: horse._id,
    label: horse.name,
  }));

  const handleHorseSelection = (selectedOptions) => {
    // selectedOptions est un tableau d'objets cheval sélectionnés
    setSelectedHorses(selectedOptions || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      horses: selectedHorses.map((horse) => horse.value),
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
        Chevaux :
        <Select
          options={horseOptions}
          isMulti
          value={selectedHorses}
          onChange={handleHorseSelection}
          placeholder="Sélectionnez un ou plusieurs chevaux"
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
