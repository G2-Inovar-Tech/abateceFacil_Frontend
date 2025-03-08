import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useMediaQuery,
  TextField,
  Paper,
  IconButton,
  Autocomplete,
  Select,
  MenuItem,
  Button,
  Container,
  Box,
  Typography,
  Stack,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import { CreditCard as CardIcon, Edit as EditIcon } from "@mui/icons-material";
import MainLayout from "../components/MainLayout.js";
import SelectCartoes from "../components/SelectCartoes.js";
import ModalGerarEditarCard from "../components/ModalGerarEditarCard.js";
import ModalConfirmacao from "../components/ModalConfirmacao.js";
import backgroundImage from "../assets/backgroundHome.png";
import Constants from "../components/Constant.js";

export default function GestaoDosSaldosECartoes() {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas

  const [cartoes, setCartoes] = useState([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState(null); // Inicializado como null
  const [selectedOption, setSelectedOption] = useState("");
  const [desabilitarSalvar, setDesabilitarSalvar] = useState(true);
  const [labelBotaoSalvar, setLabelBotaoSalvar] = useState("Salvar");

  const [saldoTransacao, setSaldoTransacao] = useState(0.0);
  const [cartaoDestino, setCartaoDestino] = useState(null); // Inicializado como null
  const [saldoText, setSaldoText] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("gerar"); // "gerar" ou "editar"
  const [cardData, setCardData] = useState(null);
  const [responsavel, setResponsavel] = useState("Fulano");
  const [statusCartao, setStatusCartao] = useState(true);
  const [isModalConfirmacaoOpen, setModalConfirmacaoOpen] = useState(false);
  const [cartaoData, setCartaoData] = useState(null);
  const [saldosCombustiveis, setSaldosCombustiveis] = useState([]);

  const [selectedCombustivelparaSaldo, setSelectedCombustivelparaSaldo] = useState("");

  const [title, setTitle] = useState("Abastece Fácil - Prefeitura de ...");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [dados, setDados] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleOperation = (success) => {
    if (success) {
      showSnackbar("Operação realizada com sucesso!", "success");
    } else {
      showSnackbar("Erro ao realizar operação!", "error");
    }
  };
  const combustiveis = [
    { key: "0", valor: "" },
    { key: "1", valor: "Etanol" },
    { key: "2", valor: "Gasolina comum" },
    { key: "3", valor: "Gasolina aditivada" },
    { key: "4", valor: "Diesel S10" },
    { key: "5", valor: "Diesel S500" },
    { key: "6", valor: "Arla 32" },
  ];

  const calcularTotal = () => {
    if (saldosCombustiveis.length === 0) return 0; // Retorna 0 se não houver saldos
  
    // Soma os valores de todos os combustíveis
    const total = saldosCombustiveis.reduce((acc, combustivel) => {
      return acc + combustivel.valor;
    }, 0);
  
    return total; // Retorna o total como um número
  };

  const handleChangeSelectCombustivel = (event) => {
    const valorSelecionado = event.target.value;
    if (valorSelecionado === "") {
      setDesabilitarSalvar(true);
    }
    if (saldoText !== "" && valorSelecionado !== "") {
      setDesabilitarSalvar(false);
    }
    setSelectedCombustivelparaSaldo(valorSelecionado);
  };

  useEffect(() => {
    const fetchCartaoData = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token"); // Obtém o token
      try {
        const response = await axios.get(`${Constants.API_BASE_URL}/api/cartao`, {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
            Accept: "*/*",
          },
        });
        setCartaoData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do cartão:", error);
       // setSnackbarMessage("Erro ao buscar dados do cartão.");
       // setOpenSnackbar(true);
      }
    };

    fetchCartaoData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const idUsuario = localStorage.getItem("idUsuario") || sessionStorage.getItem("idUsuario");
    const idPrefeitura = localStorage.getItem("idPrefeitura") || sessionStorage.getItem("idPrefeitura");
    const idAdm = localStorage.getItem("idAdm") || sessionStorage.getItem("idAdm");
    const profile = localStorage.getItem("profile") || sessionStorage.getItem("profile");
    const nomePrefeitura = localStorage.getItem("nomePrefeitura") || sessionStorage.getItem("nomePrefeitura");

    if (token) {
      setTitle("G2 Abastecimento - " + nomePrefeitura);
      setUserData({ token, idUsuario, idPrefeitura, idAdm, profile });
    }
  }, []);

  useEffect(() => {
    if (userData?.token && userData?.idPrefeitura) {
      handleBuscarInfo();
    }
  }, [userData]);

  const handleBuscarInfo = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setLoading(true);
    try {
      const response = await axios.get(
        `${Constants.API_BASE_URL}/api/listarPrefeitura/${userData.idPrefeitura}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "*/*",
          },
        }
      );
  
      const jsonData = response.data;
  
      if (jsonData.status) {
        const prefeitura = jsonData.prefeitura;
        const { PRE_ID, PRE_NOME, PRE_SALDO_ATUAL, PRE_EMAIL } = prefeitura;
        const endereco = prefeitura.endereco || {}; // Verificação para evitar erros
        const { END_CIDADE, END_ESTADO, END_CEP } = endereco;
        const contratos = prefeitura.contratos || []; // Verificação para evitar erros
        const saldoContrato = contratos.length > 0 ? contratos[0].CON_SALDO_CONTRATO : "0.000";
        const cartoes = prefeitura.cartoes || []; // Verificação para evitar erros
        const cartaoMaster = cartoes.find((cartao) => cartao.CAR_TIPO === "MASTER");
  
        if (cartaoMaster) {
          const saldosFixos = (cartaoMaster.saldos || []).map((saldo) => ({
            tipo: saldo.combustivel?.COM_DESCRICAO || "Tipo não disponível", // Verificação para evitar erros
            valor: parseFloat(saldo.SAL_VALOR || 0), // Verificação para evitar erros
          }));
          setSaldosCombustiveis(saldosFixos);
        } else {
          setSaldosCombustiveis([]);
        }
  
        const saldoCartaoMaster = (cartaoMaster?.saldos || []).reduce((total, saldo) => total + parseFloat(saldo.SAL_VALOR || 0), 0);
        const saldoNosCartoes = (parseFloat(PRE_SALDO_ATUAL) - saldoCartaoMaster).toFixed(3);
  
        if (cartoes.length > 0) {
          const cartoesFormatados = cartoes
            .filter((cartao) => cartao.CAR_TIPO && cartao.CAR_TIPO !== "MASTER") // Verificação adicional
            .map((cartao) => ({
              id: cartao.CAR_ID,
              label:
                cartao.orgao?.ORG_DESCRICAO && cartao.orgao.ORG_DESCRICAO.length > 30
                  ? cartao.orgao.ORG_DESCRICAO.substring(0, 27) + "..."
                  : cartao.orgao?.ORG_DESCRICAO || "Descrição não disponível", // Verificação para evitar erros
              num_cartao: numeroCartaoFormatado(cartao.CAR_ID),
              nomeResponsavel:
                cartao.CAR_RESP_NOME && cartao.CAR_RESP_NOME.length > 43
                  ? cartao.CAR_RESP_NOME.substring(0, 40) + ""
                  : cartao.CAR_RESP_NOME || "Nome não disponível", // Verificação para evitar erros
              status: cartao.CAR_STATUS || "Status não disponível", // Verificação para evitar erros
              saldos: (cartao.saldos || []).map((saldo) => ({
                tipo: saldo.combustivel?.COM_DESCRICAO || "Tipo não disponível", // Verificação para evitar erros
                valor: formatarValor(saldo.SAL_VALOR || 0), // Verificação para evitar erros
              })),
            }));
          setCartoes(cartoesFormatados);
        }
  
        setDados({
          prefeituraId: PRE_ID,
          nomePrefeitura: PRE_NOME,
          saldoAtual: PRE_SALDO_ATUAL,
          saldoLivre: saldoCartaoMaster.toFixed(3),
          saldoNosCartoes,
          emailPrefeitura: PRE_EMAIL,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
     // setSnackbarMessage("Erro ao buscar dados. Tente novamente.");
      //setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setCartaoSelecionado(null);
    setSelectedOption("");
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino(null);
    setDesabilitarSalvar(true);
    setLabelBotaoSalvar("Salvar");
    setSelectedCombustivelparaSaldo("");
  };

  const handleOptionChange = (event) => {
    const opcao = event.target.value;
    setSelectedOption(opcao);
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino(null);
    setDesabilitarSalvar(true);
    setSelectedCombustivelparaSaldo("");

    if (opcao === "adicionarSaldo" || opcao === "removerSaldo") {
      setLabelBotaoSalvar("Confirmar");
    }
    if (opcao === "transferirSaldo") {
      setLabelBotaoSalvar("Transferir");
    }
  };

  const setarCartaoDestino = (texto) => {
    
    setCartaoDestino(texto);
    if (saldoTransacao > 0 && texto) {
      setDesabilitarSalvar(false);
    } else {
      setDesabilitarSalvar(true);
    }
  };

  const ValidarCampoMoeda = (event) => {
    let inputValue = event.target.value;
    inputValue = inputValue.replace(/[^\d,]/g, "");
    const indexVirgula = inputValue.indexOf(",");

    if (indexVirgula !== inputValue.length - 1 && inputValue.substr(inputValue.length - 1).includes(",")) {
      inputValue = inputValue.slice(0, -1);
    }

    if (inputValue.length <= 1 && inputValue.substr(inputValue.length - 1).includes(",")) {
      inputValue = inputValue.slice(0, -1);
    }

    if (inputValue.substr(indexVirgula).length > 4) {
      inputValue = inputValue.slice(0, -1);
    }

    if (inputValue !== "") {
      setSaldoText("R$ " + inputValue);
      const saldoString = inputValue.replace(",", ".");
      const saldo = Number.parseFloat(saldoString);

      if (!isNaN(saldo) && saldo > 0) {
        setSaldoTransacao(saldo);
        if (selectedOption === "adicionarSaldo" || selectedOption === "removerSaldo") {
          if (selectedCombustivelparaSaldo !== "") {
            setDesabilitarSalvar(false);
          }
        } else if (selectedOption === "transferirSaldo" && cartaoDestino) {
          if (selectedCombustivelparaSaldo !== "") {
            setDesabilitarSalvar(false);
          }
        }
      } else {
        setDesabilitarSalvar(true);
        setSaldoTransacao(0);
      }
    } else {
      setSaldoText("");
      setSaldoTransacao(0);
      setDesabilitarSalvar(true);
    }
  };

  const handleOpenModalGerarEditarCard = (mode, data = null) => {
    setModalMode(mode);
    setCardData(data);
    setModalOpen(true);
  };

  const handleCloseModalGerarEditarCard = () => setModalOpen(false);

  const handleSubmeterAlteracaoDeResponsavel = (formData) => {
    if (modalMode === "editar") {
      editarCartao(false, formData?.responsavel);
    }
  };

  const handleOpenModalConfirmacao = () => setModalConfirmacaoOpen(true);
  const handleCloseModalConfirmacao = () => setModalConfirmacaoOpen(false);

  const handleModalConfirmacao = (confirmed) => {
    if (confirmed) {
      editarCartao(true, "");
    }
  };




// Converter para API (remove pontos e vírgulas)
const converterParaAPI = (valor) => {
  if (!valor) return 0;

  valor = valor.replace("R$ ", "");  // Remove "R$ "
  valor = valor.replace(",", ".");  // Substitui a vírgula por ponto
  const resultado = parseFloat(valor);

 // console.log("Valor após conversão:", resultado); // Verifique se o valor está correto
  return isNaN(resultado) ? 0 : resultado;
};

// Atualiza o campo de valor com a formatação correta
const handleChangeValor = (event) => {
  let inputValue = event.target.value;

  // Remove tudo que não for número ou vírgula
  inputValue = inputValue.replace(/[^\d,]/g, "");

  // Garante que haja apenas uma vírgula
  const indexVirgula = inputValue.indexOf(",");
  if (indexVirgula !== -1) {
    // Limita a 3 casas decimais após a vírgula
    inputValue = inputValue.substring(0, indexVirgula + 4);
  }

  // Adiciona "R$ " antes do valor formatado
  setSaldoText("R$ " + inputValue);
};



const adicionarRemoverSaldo = async () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  setLoading(true);

  const valorConvertido = converterParaAPI(saldoText);

  if (isNaN(valorConvertido) || valorConvertido <= 0) {
    alert("O valor do saldo deve ser maior que zero!");
    setLoading(false);
    return;
  }

  const tipoCombustivel = combustiveis.find(
    (combustivel) => combustivel.valor === selectedCombustivelparaSaldo
  );

  if (!tipoCombustivel || !tipoCombustivel.key) {
    showSnackbar("Selecione um tipo de combustível válido.", "error");
    setLoading(false);
    return;
  }

  setSaldoTransacao(valorConvertido);

  const payload = {
    PRE_ID: Number(dados.prefeituraId),
    TRA_COM_ID: Number(tipoCombustivel.key),
    TRA_VALOR: valorConvertido,
    TRA_USU_ID: Number(userData.idUsuario),
  };

  if (selectedOption === "adicionarSaldo") {
    payload.TRA_ID_CARTAO_DESTINO = Number(cartaoSelecionado.id);
  } else if (selectedOption === "removerSaldo") {
    payload.TRA_ID_CARTAO_ORIGEM = Number(cartaoSelecionado.id);
  }

  try {
    const url =
      selectedOption === "adicionarSaldo"
        ? `${Constants.API_BASE_URL}/api/adicionarSaldo`
        : `${Constants.API_BASE_URL}/api/retirarSaldo`;

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
        'Accept': '*/*',
      },
    });

    if (response.data.status) {
      showSnackbar("Sucesso: " + response.data.message, "success");

      const updatedSaldos = saldosCombustiveis.map((saldo) => {
        if (saldo.tipo === selectedCombustivelparaSaldo) {
          return {
            ...saldo,
            valor: selectedOption === "adicionarSaldo"
              ? saldo.valor + valorConvertido
              : saldo.valor - valorConvertido,
          };
        }
        return saldo;
      });

      setSaldosCombustiveis([...updatedSaldos]);

      handleBuscarInfo();
      handleCancel();
    } else {
      showSnackbar("Erro: " + response.data.message, "error");
    }
  } catch (error) {
    console.error("Erro na requisição:", error.response?.data || error.message);
    showSnackbar(
      error.response?.data?.message || "Erro ao realizar transação. Tente novamente.",
      "error"
    );
  } finally {
    setLoading(false);
  }
};

  const editarCartao = async (bloquear, nomeResponsavelAlterado) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setLoading(true);
    const idCartao = Number(cartaoSelecionado?.id);

    const dadosAlterado = bloquear
      ? { CAR_STATUS: cartaoSelecionado?.status === "ATIVO" ? "INATIVO" : "ATIVO" }
      : { CAR_RESP_NOME: nomeResponsavelAlterado };

    try {
      const response = await axios.put(
        `${Constants.API_BASE_URL}/api/cartao/${idCartao}`,
        dadosAlterado,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            "Accept": "*/*",
          },
        }
      );

      if (response.data.status) {
       // setSnackbarMessage("Sucesso:\n" + response.data.message);
      //  setOpenSnackbar(true);
        handleCancel();
        handleBuscarInfo();
      }
    } catch (error) {
      console.error("Erro ao editar cartão:", error);
     // setSnackbarMessage("Erro ao editar informações do cartão. Tente novamente.");
     // setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor) => {
    if (typeof valor !== "string") return valor;

    let valorFormatado = valor.replace(".", ",");
    let [parteInteira, parteDecimal] = valorFormatado.split(",");

    let parteInteiraFormatada = Number(parteInteira).toLocaleString("pt-BR");

    return parteDecimal
      ? `${parteInteiraFormatada},${parteDecimal}`
      : parteInteiraFormatada;
  };

  const numeroCartaoFormatado = (numCartao) => {
    if (typeof numCartao !== "string") numCartao = numCartao.toString();
    return numCartao.padStart(4, "0"); // Garante 4 dígitos, preenchendo com zeros à esquerda
  };

  const formatarValorComPontos = (valor) => {
    if (typeof valor !== "string") {
      valor = valor.toString(); // Converte para string se não for
    }
  
    // Remove qualquer caractere que não seja número ou ponto
    valor = valor.replace(/[^\d.]/g, "");
  
    // Separa a parte inteira da parte decimal
    let [parteInteira, parteDecimal] = valor.split(".");
  
    // Formata a parte inteira com pontos como separadores de milhar
    parteInteira = parteInteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
    // Substitui o ponto decimal por vírgula
    return parteDecimal ? `${parteInteira},${parteDecimal}` : parteInteira;
  };

  return (
    <MainLayout titlePage="Gestão dos Cartões e Saldos" loading={loading}>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backgroundBlendMode: "overlay",
          padding: isMobile ? 1 : 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Gestão dos Cartões e Saldos
        </Typography>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
        <Container maxWidth="md" sx={{ padding: "1% 1%" }}>
  <Box sx={{ p: 4, justifyContent: "center", padding: 0 }}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, padding: "0.5% 0%" }}>
      <Typography variant="h6" align="center" fontWeight="bold">
        Saldos Disponíveis por Combustível
      </Typography>
      <Divider sx={{ my: 2, borderRadius: "10px", borderBottomWidth: "medium" }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gap: 2,
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {saldosCombustiveis.length > 0 ? (
          saldosCombustiveis.map((combustivel, index) => {
            // Formata o valor com pontos e vírgulas
            const valorFormatado = formatarValorComPontos(combustivel.valor.toFixed(3));

            return (
              <Box
                key={index}
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                }}
              >
                <Typography variant="body1" color="primary">
                  {combustivel.tipo}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  R$ {valorFormatado}
                </Typography>
              </Box>
            );
          })
        ) : (
          <Typography variant="body1">Nenhum saldo disponível.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2, borderRadius: "10px", borderBottomWidth: "medium" }} />

      <Typography variant="h6" align="center" fontWeight="bold">
  Total: R$ {
    typeof calcularTotal() === "number"
      ? formatarValorComPontos(calcularTotal().toFixed(3))
      : "0,000" // Valor padrão caso não seja um número
  }
</Typography>
    </Paper>
  </Box>
</Container>

        <Container maxWidth="md" sx={{ padding: "3% 1%" }}>
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              padding: isMobile ? 1 : 3,
              backgroundColor: "#f0f0f7",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: isMobile ? "flex-end" : "space-between",
                flexWrap: "wrap",
                alignItems: "start",
                gap: 2,
              }}
            >
              <Box sx={{ width: isMobile ? "100%" : "none" }}>
                <Typography variant="h6">Selecione um cartão para gerenciar</Typography>
                <SelectCartoes
                  cartaoSelecionado={cartaoSelecionado}
                  cartoes={cartoes}
                  setCartaoSelecionado={setCartaoSelecionado}
                  title="Cartões"
                />
              </Box>
              {cartaoSelecionado && (
                <Box
                  sx={{
                    flex: isMobile ? 1 : 0.8,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    padding: "6px",
                    boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography variant="body1" align="center" fontWeight="bold" color="primary">
                    Cartão Selecionado: Nº {cartaoSelecionado?.num_cartao}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Setor:</strong> {cartaoSelecionado?.label} <br />
                      <strong>Responsável:</strong> {cartaoSelecionado?.nomeResponsavel} <br />
                      <strong>Status:</strong> {cartaoSelecionado?.status === "ATIVO" ? "Ativo" : "Bloqueado"}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <ModalGerarEditarCard
              open={isModalOpen}
              onClose={handleCloseModalGerarEditarCard}
              mode={modalMode}
              cardNumber={modalMode === "editar" ? cartaoSelecionado?.num_cartao : ""}
              initialData={cardData}
              onSubmit={handleSubmeterAlteracaoDeResponsavel}
            />

            {cartaoSelecionado && (
              <Box>
                <Box>
                  <IconButton
                    type="button"
                    aria-label="Criar cartão"
                    size="small"
                    sx={{
                      p: "1px",
                      maxHeight: "28px",
                      color: "#2e86c1",
                      backgroundColor: "#FFF",
                      borderRadius: "5px",
                      marginRight: "25px",
                    }}
                    onClick={() => {
                      handleOpenModalGerarEditarCard("editar", {
                        setor: cartaoSelecionado.label,
                        responsavel: cartaoSelecionado.nomeResponsavel,
                      });
                    }}
                  >
                    <CardIcon sx={{ marginRight: "5px" }} />
                    <EditIcon
                      sx={{
                        fontSize: "18px",
                        marginLeft: "-18px",
                        marginRight: "5px",
                      }}
                    />
                    <Typography size="20px">Editar cartão</Typography>
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={cartaoSelecionado?.status !== "ATIVO"}
                        onChange={handleOpenModalConfirmacao}
                        name="statusCartao"
                      />
                    }
                    label={cartaoSelecionado?.status === "ATIVO" ? "Bloquear cartão" : "Desbloquear cartão"}
                  />
                </Box>
                <ModalConfirmacao
                  open={isModalConfirmacaoOpen}
                  onClose={handleCloseModalConfirmacao}
                  title="Confirmar Ação"
                  content={
                    statusCartao
                      ? "Você tem certeza?"
                      : "Você tem certeza que deseja realizar o DESBLOQUEIO do cartão?"
                  }
                  onConfirm={handleModalConfirmacao}
                />
                <Box
                  sx={{
                    margin: "10px 0",
                    padding: "5px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                  }}
                >
                  <Typography variant="h6" align="center" fontWeight="bold">
                    Saldos do Cartão
                  </Typography>
                  <Divider sx={{ my: 2, borderRadius: "10px", borderBottomWidth: "medium" }} />
                  <Box sx={{ p: 2 }}>
                    <Stack
                      direction="row"
                      flexWrap="wrap"
                      justifyContent="space-between"
                      sx={{ gap: 2 }}
                    >
                      {cartaoSelecionado.saldos.map((combustivel, index) => (
                        <Box
                          key={index}
                          sx={{
                            width: { xs: "100%", sm: "48%", md: "30%" },
                            height: "40px",
                            px: 2,
                            py: 1,
                            borderRadius: "8px",
                            backgroundColor: "#f5f5f5",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold" color="primary">
                            {combustivel.tipo}
                          </Typography>
                          <Typography variant="body2">{combustivel.valor}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                  <Divider sx={{ my: 2, borderRadius: "10px", borderBottomWidth: "medium" }} />
                  <Typography variant="h6" align="center" fontWeight="bold">
                    Operações com o Cartão
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <RadioGroup
                      row={!isMobile}
                      name="row-radio-buttons-group"
                      value={selectedOption}
                      onChange={handleOptionChange}
                    >
                      <FormControlLabel
                        value="adicionarSaldo"
                        control={<Radio />}
                        label="Adicionar saldo"
                      />
                      <FormControlLabel
                        value="removerSaldo"
                        control={<Radio />}
                        label="Remover Saldo"
                      />
                    </RadioGroup>
                  </Box>
                  {selectedOption === "adicionarSaldo" && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box sx={{ display: "block" }}>
                        <TextField
                          label="Saldo R$"
                          value={saldoText}
                          onChange={handleChangeValor}
                          variant="outlined"
                          sx={{ width: 320 }}
                          margin="normal"
                        />
                        <Typography variant="subtitle1">Selecione o Combustível:</Typography>
                        <Select
                          value={selectedCombustivelparaSaldo}
                          onChange={handleChangeSelectCombustivel}
                          sx={{ width: isMobile ? "100%" : 320 }}
                        >
                          {combustiveis.map((item) => (
                            <MenuItem key={item.key} value={item.valor}>
                              {item.valor}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                  )}
                  {selectedOption === "removerSaldo" && (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Box sx={{ display: "block" }}>
                        <TextField
                          label="Saldo R$"
                          value={saldoText}
                          onChange={handleChangeValor}
                          variant="outlined"
                          sx={{ width: 320 }}
                          margin="normal"
                        />
                        <Typography variant="subtitle1">Selecione o Combustível:</Typography>
                        <Select
                          value={selectedCombustivelparaSaldo}
                          onChange={handleChangeSelectCombustivel}
                          sx={{ width: isMobile ? "100%" : 320 }}
                        >
                          {combustiveis.map((item) => (
                            <MenuItem key={item.key} value={item.valor}>
                              {item.valor}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                      sx={{ width: isMobile ? "48%" : "auto" }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={desabilitarSalvar}
                      onClick={adicionarRemoverSaldo}
                      sx={{ width: isMobile ? "48%" : "auto" }}
                    >
                      {labelBotaoSalvar}
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}