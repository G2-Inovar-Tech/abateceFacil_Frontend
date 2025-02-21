import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userProfile } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  /** Esse allowedRoles recebe qual perfil é permitido para a rota que está tentando acessar
   * e o If verifica se é compativel com o perfil do usuario logado!*/
  if (!allowedRoles.includes(userProfile)) {
    if (userProfile === "ADM") {
      return <Navigate to="/home" replace />;
    } else if (userProfile === "PREFEITURA") {
      return <Navigate to="/home-prefeitura" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;

  /** Primeira implementação de autenticação da aplicação - Depois com,  a necessidade de perfis,
   * ficou obsoleto está implementação.
   */
  // return isAuthenticated ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/login" replace state={{ from: location }} />
  // );
};

export default ProtectedRoute;
