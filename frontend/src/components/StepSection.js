import React from 'react';
import '../styles/StepSection.scss';

function StepsSection() {
  return (
    <section className="steps">
      <h2>Comment réserver votre espace ?</h2>
      <div className="step-container">
        <div className="step">
          <div className="circle">1</div>
          <p>Se connecter à votre compte</p>
        </div>
        <div className="line" />
        <div className="step">
          <div className="circle">2</div>
          <p>Choisir un créneau horaire et votre cheval</p>
        </div>
        <div className="line" />
        <div className="step">
          <div className="circle">3</div>
          <p>Confirmer votre réservation !</p>
        </div>
      </div>
    </section>
  );
}

export default StepsSection;
