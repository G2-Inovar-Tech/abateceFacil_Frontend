import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth =
      localStorage.getItem("isAuthenticated") ||
      sessionStorage.getItem("isAuthenticated");
    return storedAuth === "true"; // Retorna true se estiver autenticado
  });
  
  const [userProfile, setUserProfile] = useState(() => { // 'ADM' ou 'PREFEITURA'
    const storedProfile =
      localStorage.getItem("profile") ||
      sessionStorage.getItem("profile");
    return storedProfile; // Retorna o perfil autenticado
  });

  const login = (rememberMe, profile, {token, idUsuario, idPrefeitura, idAdm}) => {
    setIsAuthenticated(true);
    setUserProfile(profile); // Define o perfil ao autenticar
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("idUsuario", idUsuario);
      localStorage.setItem("idPrefeitura", idPrefeitura);
      localStorage.setItem("idAdm", idAdm);
      localStorage.setItem("isAuthenticated", "true"); // Salva no localStorage
      localStorage.setItem("profile", profile); // Salva no localStorage
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("idUsuario", idUsuario);
      sessionStorage.setItem("idPrefeitura", idPrefeitura);
      sessionStorage.setItem("idAdm", idAdm);
      sessionStorage.setItem("isAuthenticated", "true"); // Salva no sessionStorage
      sessionStorage.setItem("profile", profile); // Salva no localStorage
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem("token");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("idPrefeitura");
    localStorage.removeItem("idAdm");
    localStorage.removeItem('isAuthenticated'); // Remove do localStorage
    localStorage.removeItem("profile"); // Remove informação sobre perfil no localStorage
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("idUsuario");
    sessionStorage.removeItem("idPrefeitura");
    sessionStorage.removeItem("idAdm");
    sessionStorage.removeItem('isAuthenticated'); // Remove do sessionStorage
    sessionStorage.removeItem("profile"); // informação sobre perfil no sessionStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
