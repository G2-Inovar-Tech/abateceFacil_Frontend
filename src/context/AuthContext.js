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

  const login = (rememberMe, profile, {token, idUsuario, idPrefeitura, idAdm, nomePrefeitura}) => {
    setIsAuthenticated(true);
    setUserProfile(profile); // Define o perfil ao autenticar
    if (rememberMe) {
      localStorage.setItem("token", token);
      localStorage.setItem("idUsuario", idUsuario);
      localStorage.setItem("idAdm", idAdm);
      localStorage.setItem("idPrefeitura", idPrefeitura);
      localStorage.setItem("nomePrefeitura", nomePrefeitura);
      localStorage.setItem("isAuthenticated", "true"); // Salva no localStorage
      localStorage.setItem("profile", profile); // Salva no localStorage
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("idUsuario", idUsuario);
      sessionStorage.setItem("idAdm", idAdm);
      sessionStorage.setItem("idPrefeitura", idPrefeitura);
      sessionStorage.setItem("nomePrefeitura", nomePrefeitura);
      sessionStorage.setItem("isAuthenticated", "true"); // Salva no sessionStorage
      sessionStorage.setItem("profile", profile); // Salva no localStorage
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    localStorage.removeItem("token");
    localStorage.removeItem("idUsuario");
    localStorage.removeItem("idAdm");
    localStorage.removeItem("idPrefeitura");
    localStorage.removeItem("nomePrefeitura");
    localStorage.removeItem('isAuthenticated'); // Remove do localStorage
    localStorage.removeItem("profile"); // Remove informação sobre perfil no localStorage
    
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("idUsuario");
    sessionStorage.removeItem("idAdm");
    sessionStorage.removeItem("idPrefeitura");
    sessionStorage.removeItem("nomePrefeitura");
    sessionStorage.removeItem('isAuthenticated'); // Remove do sessionStorage
    sessionStorage.removeItem("profile"); // informação sobre perfil no sessionStorage
  };

  /** Nova abodagem que descobrir para limpar os dados salvos */
  // const logout = () => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   window.location.href = "/login"; // Redireciona para a página de login
  // };
  

  return (
    <AuthContext.Provider value={{ isAuthenticated, userProfile, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
