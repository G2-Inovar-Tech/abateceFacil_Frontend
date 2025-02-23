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
import Cadastroprefeitura from "./pages/CadastroPrefeitura.js";
import CadastroPosto from "./pages/CadastroPosto.js";
import Configuracoes from "./pages/Configuracoes.js";
import HomePrefeitura from "./pages/HomePrefeitura.js";
import GestaoDosSaldosECartoes from "./pages/GestaoDosSaldosECartoes";
import HistoricoPrefeitura from "./pages/HistoricoPrefeitrua.js";
import CadastroCartao from "./pages/CadastrarCartao.js";
import CadastroVeiculo from "./pages/CadastroVeiculo.js";
import ContratoPrefeitura from "./pages/ContratoPrefeitura.js";
import VincularPostoContrato from "./pages/VincularPostoContrato.js";
import VincularUsuarioPrefeitura from "./pages/VincularUsuarioPrefeitura.js";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Agrupamento de rotas protegidas - Rotas para ADM  */}
          <Route element={<ProtectedRoute allowedRoles={['ADM']} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/gerenciar-prefeituras" element={<GerenciarPrefeituras />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="/cadastro-prefeitura" element={<Cadastroprefeitura />} />
            <Route path="/cadastro-posto" element={<CadastroPosto />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/cadastro-cartao" element={<CadastroCartao />} />
            <Route path="/cadastro-veiculo" element={<CadastroVeiculo />} />
            <Route path="/contrato-prefeitura" element={<ContratoPrefeitura />} />
            <Route path="/vincular-posto-contrato" element={<VincularPostoContrato />} />
            <Route path="/vincular-usuario-prefeitura" element={<VincularUsuarioPrefeitura />} />


          </Route>

          {/* Rotas para Prefeitura */}
          <Route element={<ProtectedRoute allowedRoles={['PREFEITURA']} />}>
            <Route path="/home-prefeitura" element={<HomePrefeitura />} />
            <Route path="/gestao-saldos-cartoes" element={<GestaoDosSaldosECartoes />} />
            <Route path="/historico-prefeitura" element={<HistoricoPrefeitura />} />
          </Route>

          {/* Página 404 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
