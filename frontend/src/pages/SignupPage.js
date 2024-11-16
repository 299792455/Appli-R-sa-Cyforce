import React, { useState } from 'react';
import '../styles/SignupPage.scss';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }), // Envoi des données au backend
      });
      const data = await response.json();
      if (response.ok) {
        alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
        // Exemple de redirection
        // window.location.href = '/login';
      } else {
        alert(data.error || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      alert('Une erreur réseau s\'est produite.');
      console.error(error);
    }
  };

  return (
    <div className="signup-page">
      <form onSubmit={handleSubmit} className="signup-form">
        <h2>Inscription</h2>
        <label>
          Nom d'utilisateur
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
  Adresse e-mail
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required // Rendre le champ obligatoire
  />
</label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default SignupPage;
