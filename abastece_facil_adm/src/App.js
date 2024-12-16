import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Login from "./pages/Login.js";
import NotFoundPage from "./pages/NotFound";
import Home from "./pages/Home.js";
import GerenciarPrefeituras from "./pages/GerenciarPrefeituras.js";
import Relatorios from "./pages/Relatorios.js";
import CadastroUsuario from "./pages/CadastroUsuario.js";
import CadastroPosto from "./pages/CadastroPosto.js";
import Configuracoes from "./pages/Configuracoes.js";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Agrupamento de rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/gerenciar-prefeituras" element={<GerenciarPrefeituras />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="/cadastro-posto" element={<CadastroPosto />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
