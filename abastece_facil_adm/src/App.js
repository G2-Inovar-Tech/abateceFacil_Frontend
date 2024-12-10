import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.js"
import Home from "./pages/Home.js";
import GerenciarPrefeituras from "./pages/GerenciarPrefeituras.js";
import Relatorios from "./pages/Relatorios.js";
import CadastroUsuario from "./pages/CadastroUsuario.js";
import Configuracoes from "./pages/Configuracoes.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home"  element={<Home />} />
        <Route path="/gerenciar-prefeituras" element={<GerenciarPrefeituras />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="*" element={<h1>404: Página não encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
