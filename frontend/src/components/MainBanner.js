import React from 'react';
import '../styles/MainBanner.scss';


function MainBanner() {
  return (
    <section className="main-banner">
      <h1>Réservez un espace pour vos chevaux</h1>
      <p>Sélectionnez un horaire, choisissez votre cheval, et réservez directement en ligne !</p>
      <button className="cta-button"><a href="/booking">Réserver maintenant</a></button>
    </section>
  );
}

export default MainBanner;
