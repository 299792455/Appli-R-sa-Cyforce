import { createContext, useState, useEffect } from 'react';
import { fetchUserInfo } from '../services/bookingService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserInfo()
        .then((userInfo) => {
          setUser(userInfo);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error(error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token); // Stocker le token
    localStorage.setItem('user', JSON.stringify(userData)); // Stocker les données utilisateur
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
