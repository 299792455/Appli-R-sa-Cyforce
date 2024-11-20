import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchUserInfo, fetchHorses } from '../services/bookingService';
import HorseCreationModal from '../components/HorseCreationModal';
import Header from '../components/Header'; // Assurez-vous que le chemin est correct
import Footer from '../components/Footer';
import BookingCalendar from '../components/BookingCalendar';
import '../styles/UserProfile.scss';


const UserProfile = () => {
  const { user, logout } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState(null);
  const [horses, setHorses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) {
      fetchUserInfo()
        .then((data) => setUserInfo(data))
        .catch((error) => console.error('Erreur lors de la récupération des infos utilisateur', error));
    } else {
      setUserInfo(user);
    }

    // Charger les chevaux de l'utilisateur
    fetchHorses()
      .then((data) => setHorses(data))
      .catch((error) => console.error('Erreur lors de la récupération des chevaux', error));
  }, [user]);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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
            <ul>
              {horses.map((horse) => (
                <li key={horse._id}>{horse.name} - {horse.breed}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun cheval enregistré.</p>
          )}

          {showModal && <HorseCreationModal onClose={closeModal} />}
          <button onClick={openModal} className="cta-button">Ajouter un cheval</button>
        </div>
        <div className="calendar-container">
          <BookingCalendar />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
