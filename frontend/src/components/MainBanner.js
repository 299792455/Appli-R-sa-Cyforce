import React from 'react';
import '../styles/MainBanner.scss';
import imageBanner from '../styles/images/04-4-social-composer-groupe-1140x761.jpg';

function MainBanner() {
  return (
    <section className="main-banner">
      <div className="banner-image">
        <img
          src={imageBanner}
          alt="Illustration de chevaux dans un champ"
        />
      </div>
      <div className="banner-content">
        <h1>Réservez un espace pour vos chevaux</h1>
        <p>Sélectionnez un horaire, choisissez votre cheval, et réservez directement en ligne !</p>
        <div className="cta-button-container">
        <a href="/booking" className="cta-button">
          Réserver maintenant
        </a>
      </div>
      </div>
    </section>
  );
}

export default MainBanner;
