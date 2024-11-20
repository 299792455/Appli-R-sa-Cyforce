import React, { useState } from 'react';
import '../styles/SignupPage.scss';
import Header from '../components/Header'; // Assurez-vous que le chemin est correct
import Footer from '../components/Footer'; // Assurez-vous que le chemin est correct

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
        body: JSON.stringify({ name, email, password }),
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
    <div>
      <Header />
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
              required
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
      <Footer />
    </div>
  );
}

export default SignupPage;
