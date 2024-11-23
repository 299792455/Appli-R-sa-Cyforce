// HorseCreationModal.js

import React, { useState } from 'react';
import { createHorse } from '../services/bookingService';
import "../styles/HorseCreationModal.scss";

const HorseCreationModal = ({ onClose, onHorseCreated }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const horseData = { name, breed, socialSecurityNumber };
    console.log("Données envoyées :", horseData);

    try {
      await createHorse(horseData);
      alert('Cheval ajouté avec succès');
      onHorseCreated(); // Appeler le callback pour mettre à jour la liste des chevaux
      onClose(); // Fermer la modale après succès
    } catch (error) {
      console.error('Erreur lors de l\'ajout du cheval', error);
      if (error.response) {
        console.error('Réponse du serveur :', error.response.data);
        alert(`Erreur : ${error.response.data.message}`);
      } else {
        alert('Une erreur inattendue est survenue.');
      }
    }
  };

  return (
    <div className="horse-creation-modal">
      <h2>Ajouter un cheval</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nom :
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Race :
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </label>

        <label>
          Numéro de sécurité sociale :
          <input
            type="text"
            value={socialSecurityNumber}
            onChange={(e) => setSocialSecurityNumber(e.target.value)}
            required
          />
        </label>

        <button type="submit">Ajouter</button>
        <button type="button" onClick={onClose}>Annuler</button>
      </form>
    </div>
  );
};

export default HorseCreationModal;
