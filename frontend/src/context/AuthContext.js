import { createContext, useState, useEffect } from "react";
import { fetchUserInfo } from "../services/bookingService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ajoute un état de chargement

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
  
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  
    if (token) {
      fetchUserInfo()
        .then((userInfo) => {
          setUser(userInfo);
          setIsLoggedIn(true);
        })
        .catch((error) => {
          console.error(error);
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
