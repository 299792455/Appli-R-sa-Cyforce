import React from 'react';
import '../styles/StepSection.scss';

function StepsSection() {
  return (
    <section className="steps">
      <h2>Comment réserver votre espace ?</h2>
      <div className="step-container">
        <div className="step">
          <h3>1</h3>
          <p>Se connecter à votre compte</p>
        </div>
        <div className="step">
          <h3>2</h3>
          <p>Choisir votre créneau horaire et votre cheval</p>
        </div>
        <div className="step">
          <h3>3</h3>
          <p>Confirmer votre réservation !</p>
        </div>
      </div>
      <div className="cta-button-container">
        <a href="/booking" className="cta-button">
          Réserver maintenant
        </a>
      </div>
    </section>
  );
}

export default StepsSection;
