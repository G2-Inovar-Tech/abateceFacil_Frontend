import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import ProtectedRoute from "./components/ProtectedRoute.js";
import Login from "./pages/Login.js";
import NotFoundPage from "./pages/NotFound";
import Home from "./pages/GestaoDosSaldosECartoesADM.js";
import GerenciarPrefeituras from "./pages/GerenciarPrefeituras.js";
import RelatoriosGeral from "./pages/RelatoriosGeral.js";
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
import VincularUsuarioPosto from "./pages/VincularUsuarioPosto.js";
import CadastroEndereco from "./pages/CadastrarEndereco.js";
import CadastroOrgao from "./pages/CadastrarOrgao.js";
import GestaoCartao from "./pages/GestaoDosSaldosECartoesADM.js";
import RelatoriosDetalhado from "./pages/RelatoriosDetalhado.js";
import RelatoriosPosto from "./pages/RelatoriosPosto.js";
import CadastrarVeiculoPre from "./pages/CadastroVeiculoPRE.js";
import CadastrarMotoristaADM from "./pages/CadastrarMotoristaADM.js";
import CadastrarMotoristaPre from "./pages/CadastrarMotoristaPRE.js";


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
          {/*  <Route path="/gerenciar-prefeituras" element={<GerenciarPrefeituras />} />*/}
            <Route path="/relatorio-geral" element={<RelatoriosGeral />} />
            <Route path="/cadastro-usuario" element={<CadastroUsuario />} />
            <Route path="/cadastro-prefeitura" element={<Cadastroprefeitura />} />
            <Route path="/cadastro-posto" element={<CadastroPosto />} />
          {/*  <Route path="/configuracoes" element={<Configuracoes />} />*/}
            <Route path="/cadastro-cartao" element={<CadastroCartao />} />
            <Route path="/cadastro-veiculo" element={<CadastroVeiculo />} />
            <Route path="/contrato-prefeitura" element={<ContratoPrefeitura />} />
            <Route path="/vincular-prefeitura" element={<VincularUsuarioPrefeitura />} />
            <Route path="/vincular-posto" element={<VincularUsuarioPosto />} />
            <Route path="/vincular-posto-contrato" element={<VincularPostoContrato />} />
            <Route path="/cadastro-endereco" element={<CadastroEndereco />}/>
            <Route path= "/cadastro-orgao" element={<CadastroOrgao/>}/>
            <Route path= "/gestao-saldos-cartoes-adm" element={<GestaoCartao/>}/>
            <Route path="/relatorio-detalhado" element={<RelatoriosDetalhado />} />
            <Route path="/relatorio-posto" element={<RelatoriosPosto />} />
            <Route path="/cadastro-motorista-ADM" element={<CadastrarMotoristaADM />} />


          </Route>

          {/* Rotas para Prefeitura */}
          <Route element={<ProtectedRoute allowedRoles={['PREFEITURA']} />}>
            <Route path="/home-prefeitura" element={<HomePrefeitura />} />
            <Route path="/gestao-saldos-cartoes" element={<GestaoDosSaldosECartoes />} />
            <Route path="/historico-prefeitura" element={<HistoricoPrefeitura />} />
            <Route path="/cadastro-veiculo-pre" element={<CadastrarVeiculoPre />} />
            <Route path="/cadastro-motorista-pre" element={<CadastrarMotoristaPre />} />
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
