import React from 'react';
import '../styles/StepSection.scss';


function StepsSection() {
  return (
    <section className="steps">
      <h2>Comment réserver votre espace ?</h2>
      <div className="step">
        <h3>1</h3>
        <p>Choisissez le créneau horaire souhaité</p>
      </div>
      <div className="step">
        <h3>2</h3>
        <p>Sélectionnez votre cheval</p>
      </div>
      <div className="step">
        <h3>3</h3>
        <p>Confirmez votre réservation !</p>
      </div>
    </section>
  );
}

export default StepsSection;
