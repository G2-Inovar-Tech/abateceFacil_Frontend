import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth =
      localStorage.getItem("isAuthenticated") ||
      sessionStorage.getItem("isAuthenticated");
    return storedAuth === "true"; // Retorna true se estiver autenticado
  });

  const login = (rememberMe) => {
    setIsAuthenticated(true);
    if (rememberMe) {
      localStorage.setItem("isAuthenticated", "true"); // Salva no localStorage
    } else {
      sessionStorage.setItem("isAuthenticated", "true"); // Salva no sessionStorage
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated'); // Remove do localStorage
    sessionStorage.removeItem('isAuthenticated'); // Remove do sessionStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
