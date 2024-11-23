// UserProfile.js

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchUserInfo, fetchHorses, updateHorse, deleteHorse } from '../services/bookingService';
import HorseCreationModal from '../components/HorseCreationModal';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingCalendar from '../components/BookingCalendar';
import '../styles/UserProfile.scss';
import '../styles/HorseCreationModal.scss'; // Importer les styles de la modale
import horseIcon from '../styles/images/logoMiniaCheval.png';

const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [horses, setHorses] = useState([]);
  const [showCreationModal, setShowCreationModal] = useState(false);
  const [selectedHorse, setSelectedHorse] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  const refreshHorses = () => {
    fetchHorses()
      .then(setHorses)
      .catch((error) => console.error('Erreur lors de la récupération des chevaux', error));
  };

  useEffect(() => {
    if (!user) {
      fetchUserInfo()
        .then((data) => setUserInfo(data))
        .catch((error) => console.error('Erreur lors de la récupération des infos utilisateur', error));
    } else {
      setUserInfo(user);
    }
    refreshHorses();
  }, [user]);

  const openCreationModal = () => setShowCreationModal(true);
  const closeCreationModal = () => setShowCreationModal(false);

  const openDetailsModal = (horse) => {
    setSelectedHorse(horse);
    setShowDetailsModal(true);
    setIsEditing(false);
  };
  const closeDetailsModal = () => {
    setSelectedHorse(null);
    setShowDetailsModal(false);
    setIsEditing(false);
  };

  const handleUpdateHorse = (e) => {
    e.preventDefault();
    if (selectedHorse) {
      updateHorse(selectedHorse._id, selectedHorse)
        .then(() => {
          alert('Cheval mis à jour avec succès.');
          refreshHorses();
          closeDetailsModal();
        })
        .catch((error) => console.error('Erreur lors de la mise à jour du cheval', error));
    }
  };

  const handleDeleteHorse = () => {
    setShowConfirmDeleteModal(true);
  };

  const confirmDeleteHorse = () => {
    if (selectedHorse) {
      const horseId = selectedHorse._id;
      if (!horseId) {
        console.error('ID du cheval non trouvé');
        return;
      }
      deleteHorse(horseId)
        .then(() => {
          alert('Cheval supprimé avec succès.');
          refreshHorses();
          closeDetailsModal();
          setShowConfirmDeleteModal(false);
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du cheval', error);
          setShowConfirmDeleteModal(false);
        });
    }
  };

  const cancelDeleteHorse = () => {
    setShowConfirmDeleteModal(false);
  };

  if (!userInfo) {
    return <p>Chargement des informations utilisateur...</p>;
  }

  return (
    <>
      <Header />
      <div className="user-profile-container">
        <div className="user-info">
          <h2>Mon Profil</h2>
          <p><strong>Nom :</strong> {userInfo.name}</p>
          <p><strong>Email :</strong> {userInfo.email}</p>
          <button onClick={logout} className="cta-button">Déconnexion</button>

          <h3>Mes chevaux</h3>
          {horses.length > 0 ? (
            <ul className="horse-list">
              {horses.map((horse) => (
                <li key={horse._id} onClick={() => openDetailsModal(horse)} className="horse-item">
                  {horse.name}
                  <img src={horseIcon} alt="Cheval" className="horse-icon" />
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun cheval enregistré.</p>
          )}

          <button onClick={openCreationModal} className="cta-button">Ajouter un cheval</button>
        </div>
        <div className="calendar-container">
          <BookingCalendar />
        </div>
      </div>

      {showCreationModal && (
        <HorseCreationModal onClose={closeCreationModal} onHorseCreated={refreshHorses} />
      )}

      {/* Modale de détails du cheval */}
      {showDetailsModal && (
        <div className="horse-creation-modal-wrapper">
          <div className="horse-creation-modal">
            {selectedHorse && (
              <>
                <h2>{isEditing ? "Modifier le cheval" : "Détails du cheval"}</h2>
                {isEditing ? (
                  <form onSubmit={handleUpdateHorse}>
                    <label>
                      Nom :
                      <input
                        type="text"
                        value={selectedHorse.name}
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, name: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Race :
                      <input
                        type="text"
                        value={selectedHorse.breed}
                        onChange={(e) => setSelectedHorse({ ...selectedHorse, breed: e.target.value })}
                        required
                      />
                    </label>
                    <label>
                      Numéro de sécurité sociale :
                      <input
                        type="text"
                        value={selectedHorse.socialSecurityNumber}
                        onChange={(e) =>
                          setSelectedHorse({ ...selectedHorse, socialSecurityNumber: e.target.value })
                        }
                        required
                      />
                    </label>
                    <button type="submit">Enregistrer</button>
                    <button type="button" onClick={closeDetailsModal}>Annuler</button>
                  </form>
                ) : (
                  <>
                    <p><strong>Nom :</strong> {selectedHorse.name}</p>
                    <p><strong>Race :</strong> {selectedHorse.breed}</p>
                    <p>
                      <strong>Numéro de sécurité sociale :</strong>{' '}
                      {selectedHorse.socialSecurityNumber}
                    </p>
                    <div style={{ marginTop: "20px" }}>
                      <button
                        onClick={() => setIsEditing(true)}
                        style={{ marginRight: "10px" }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={handleDeleteHorse}
                        style={{ backgroundColor: "red", color: "white", marginRight: "10px" }}
                      >
                        Supprimer
                      </button>
                      <button onClick={closeDetailsModal}>Fermer</button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Modale de confirmation de suppression */}
      {showConfirmDeleteModal && (
        <div className="horse-creation-modal-wrapper">
          <div className="horse-creation-modal">
            <h2>Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer ce cheval ?</p>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
              <button
                onClick={confirmDeleteHorse}
                style={{ backgroundColor: "red", color: "white", marginRight: "10px" }}
              >
                Supprimer
              </button>
              <button onClick={cancelDeleteHorse}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default UserProfile;
