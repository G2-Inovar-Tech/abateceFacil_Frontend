import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userProfile } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userProfile)) {
    if (userProfile === "ADM") {
      return <Navigate to="/home" replace />;
    } else if (userProfile === "PREFEITURA") {
      return <Navigate to="/home-prefeitura" replace state={{ from: location }} />;
    }
  }

  return <Outlet />;

  // return isAuthenticated ? (
  //   <Outlet />
  // ) : (
  //   <Navigate to="/login" replace state={{ from: location }} />
  // );
};

export default ProtectedRoute;
