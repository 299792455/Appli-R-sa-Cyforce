import React, { useState } from 'react';
import { createHorse } from '../services/bookingService';

const HorseCreationModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [socialSecurityNumber, setSocialSecurityNumber] = useState('');

  // handleSubmit : Gestionnaire de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    const horseData = { name, breed, socialSecurityNumber };
    console.log("Données envoyées :", horseData); // Vérifiez les données envoyées

    createHorse(horseData)
      .then(() => {
        alert('Cheval ajouté avec succès');
        onClose(); // Fermer la modale après succès
      })
      .catch((error) => {
        console.error('Erreur lors de l\'ajout du cheval', error);
        if (error.response) {
          console.error('Réponse du serveur :', error.response.data);
          alert(`Erreur : ${error.response.data.message}`);
        } else {
          alert('Une erreur inattendue est survenue.');
        }
      });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Ajouter un cheval</h2>
        <form onSubmit={handleSubmit}>
          <label>Nom :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Race :</label>
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />

          <label>Numéro de sécurité sociale :</label>
          <input
            type="text"
            value={socialSecurityNumber}
            onChange={(e) => setSocialSecurityNumber(e.target.value)}
            required
          />

          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </form>
      </div>
    </div>
  );
};

export default HorseCreationModal;
