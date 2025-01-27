import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth =
      localStorage.getItem("isAuthenticated") ||
      sessionStorage.getItem("isAuthenticated");
    return storedAuth === "true"; // Retorna true se estiver autenticado
  });
  // const [userProfile, setUserProfile] = useState(null); // 'ADM' ou 'PREFEITURA'

  //const [isProfile, setIsProfile] = useState(() => {
  const [userProfile, setUserProfile] = useState(() => {
    const storedProfile =
      localStorage.getItem("profile") ||
      sessionStorage.getItem("profile");
    return storedProfile; // Retorna o perfil autenticado
  });

  const login = (rememberMe, profile) => {
    setIsAuthenticated(true);
    setUserProfile(profile); // Define o perfil ao autenticar
    if (rememberMe) {
      localStorage.setItem("isAuthenticated", "true"); // Salva no localStorage
      localStorage.setItem("profile", profile); // Salva no localStorage
    } else {
      sessionStorage.setItem("isAuthenticated", "true"); // Salva no sessionStorage
      sessionStorage.setItem("profile", profile); // Salva no localStorage
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem('isAuthenticated'); // Remove do localStorage
    sessionStorage.removeItem('isAuthenticated'); // Remove do sessionStorage
    localStorage.removeItem("profile"); // Remove informação sobre perfil no localStorage
    sessionStorage.removeItem("profile"); // informação sobre perfil no sessionStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
