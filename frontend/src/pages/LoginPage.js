import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.scss';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Assurez-vous du chemin correct
import Footer from '../components/Footer'; // Assurez-vous du chemin correct

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token, { name: data.name, email: data.email });
        navigate('/'); // Redirige vers la page d'accueil
      } else {
        alert(data.error || 'Erreur de connexion');
      }
    } catch (error) {
      alert("Une erreur réseau s'est produite.");
      console.error(error);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Connexion</h2>
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
          <button type="submit">Se connecter</button>
          <p>Besoin d'aide ?</p>
          <p>
            Pas encore inscrit ? <Link to="/signup">Créer un compte</Link>
          </p>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
