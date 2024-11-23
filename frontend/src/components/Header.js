// Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.scss';
import { AuthContext } from '../context/AuthContext';
import imageHeader from '../styles/images/horse_logo_black_bg.png';

function Header() {
  const { isLoggedIn, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <img
          src={imageHeader}
          alt="Logo manège Maëlian"
        />
      <nav>
        <Link to="/">Accueil</Link>
        {/* <Link to="/booking">Réservations</Link> */}
        {isLoggedIn ? (
          <>
            {user && user.name ? (
              <span>Bienvenue, {user.name}</span>
            ) : (
              <span>Bienvenue</span>
            )}
            <Link to="/profile">(Gérer mon Compte)</Link> {/* Lien vers la page profil */}
            <button onClick={handleLogout}>Se déconnecter</button>
          </>
        ) : (
          <>
            <Link to="/login">Se connecter</Link>
            <Link to="/signup">S'inscrire</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
