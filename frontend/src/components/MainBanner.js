import React, { useContext } from 'react';
import '../styles/MainBanner.scss';
import imageBanner from '../styles/images/04-4-social-composer-groupe-1140x761.jpg';
import { AuthContext } from '../context/AuthContext'; // Import du contexte d'authentification
import { useNavigate } from 'react-router-dom'; // Pour la navigation

function MainBanner() {
  const { isLoggedIn } = useContext(AuthContext); // Accès à l'état de connexion
  const navigate = useNavigate(); // Hook de navigation

  const handleReservationClick = () => {
    if (isLoggedIn) {
      navigate('/profile'); // Redirection vers UserProfile.js si connecté
    } else {
      navigate('/login'); // Redirection vers la page de connexion si non connecté
    }
  };

  return (
    <section className="main-banner">
      <div className="banner-image">
        <img
          src={imageBanner}
          alt="Illustration de chevaux dans le manège à cheval Maëlian"
        />
      </div>
      <div className="banner-content">
        <h1>Réservez un espace pour vos chevaux</h1>
        <p>Sélectionnez un horaire, choisissez votre cheval, et réservez directement en ligne !</p>
        <div className="cta-button-container">
          <button className="cta-button" onClick={handleReservationClick}>
            Réserver maintenant
          </button>
        </div>
      </div>
    </section>
  );
}

export default MainBanner;
