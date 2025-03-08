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

  const [prefeituras, setPrefeituras] = useState([]);
  const [prefeituraSelecionada, setPrefeituraSelecionada] = useState(null);
  const [searchPrefeitura, setSearchPrefeitura] = useState(""); // Estado para o valor de busca

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const statusCartaoTexto = cartaoSelecionado?.status === "ATIVO" ? "Ativo" : "Bloqueado";


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



  //*****
  useEffect(() => {
    const fetchPrefeituras = async () => {
      try {
        const response = await axios.get(`${Constants.API_BASE_URL}/api/prefeitura`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          }
        });

        if (response.data && Array.isArray(response.data.prefeituras)) {
          setPrefeituras(response.data.prefeituras);
        } else {
          setPrefeituras([]);
        }
      } catch (error) {
        console.error("Erro ao buscar prefeituras:", error.response?.data || error.message);
        setPrefeituras([]);
      }
    };

    fetchPrefeituras();
  }, []);

  const fetchCartoes = async (idPrefeitura) => {
    if (!idPrefeitura) return; // Evita chamadas desnecessárias

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token"); // Obtém o token do localStorage ou sessionStorage
      const response = await axios.get(`${Constants.API_BASE_URL}/api/listarPrefeitura/${idPrefeitura}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Inclui o token no cabeçalho
          'Accept': '*/*',
        }
      });
      // console.log("Resposta da API para cartões comuns:", response.data); // Log para depuração



      if (response.data && response.data.prefeitura) {
        const cartoesFormatados = response.data.prefeitura.cartoes
          .filter((cartao) => cartao.CAR_TIPO !== "MASTER")
          .map((cartao) => ({
            id: cartao.CAR_ID,
            label: cartao.orgao?.ORG_DESCRICAO
              ? cartao.orgao.ORG_DESCRICAO.length > 30
                ? cartao.orgao.ORG_DESCRICAO.substring(0, 27) + "..."
                : cartao.orgao.ORG_DESCRICAO
              : "Descrição não disponível",
            num_cartao: numeroCartaoFormatado(cartao.CAR_ID),
            nomeResponsavel: cartao.CAR_RESP_NOME
              ? cartao.CAR_RESP_NOME.length > 43
                ? cartao.CAR_RESP_NOME.substring(0, 40) + ""
                : cartao.CAR_RESP_NOME
              : "Nome não disponível",
            status: cartao.CAR_STATUS,
            saldos: cartao.saldos?.map((saldo) => ({
              tipo: saldo.combustivel?.COM_DESCRICAO || "Tipo não disponível",
              valor: formatarValor(saldo.SAL_VALOR || 0),
            })) || [],
          }));

        setCartoes(cartoesFormatados);
        // console.log("Cartões comuns carregados:", cartoesFormatados); // Confirmação de que os cartões foram salvos no estado
      } else {
        setCartoes([]);
      }
    } catch (error) {
      console.error("Erro ao buscar cartões:", error);
      setCartoes([]); // Em caso de erro, limpa os cartões
    }
  };


  const handleSelectPrefeitura = async (idPrefeitura) => {
    if (!idPrefeitura) {
      console.warn("Tentativa de carregar dados sem ID de prefeitura.");
      return;
    }

    setPrefeituraSelecionada(idPrefeitura);
    setLoading(true);

    try {
      const response = await axios.get(`${Constants.API_BASE_URL}/api/listarPrefeitura/${idPrefeitura}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        }
      });
      // console.log("Dados recebidos da API:", response.data);

      if (response.data && response.data.status && response.data.prefeitura) {
        const prefeitura = response.data.prefeitura;
        setDados(prefeitura);

        // 🔹 Busca o cartão MASTER da prefeitura
        const cartaoMaster = prefeitura.cartoes?.find((cartao) => cartao.CAR_TIPO === "MASTER");

        setDados({
          prefeituraId: prefeitura.PRE_ID,
          nomePrefeitura: prefeitura.PRE_NOME,
          saldoAtual: prefeitura.PRE_SALDO_ATUAL,
          emailPrefeitura: prefeitura.PRE_EMAIL,
        });

        if (cartaoMaster) {
          const saldosFixos = cartaoMaster.saldos.map((saldo) => ({
            tipo: saldo.combustivel.COM_DESCRICAO,
            valor: parseFloat(saldo.SAL_VALOR),
          }));
          setSaldosCombustiveis(saldosFixos);
        } else {
          setSaldosCombustiveis([]);
        }

        // 🔹 Agora busca os cartões comuns
        fetchCartoes(idPrefeitura); // Chamada da função fetchCartoes
      }
    } catch (error) {
      console.error("Erro ao buscar dados da prefeitura:", error);
    } finally {
      setLoading(false);
    }
  };


  // Filtra as prefeituras com base no valor de busca
  const filteredPrefeituras = prefeituras.filter((prefeitura) =>
    prefeitura.PRE_NOME.toLowerCase().includes(searchPrefeitura.toLowerCase())
  );

  //**** 

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const fetchCartaoData = async () => {
      try {
        const response = await axios.get(`${Constants.API_BASE_URL}/api/cartao`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Accept': '*/*',
          }
        });
        setCartaoData(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do cartão:", error);
        //setSnackbarMessage("Erro ao buscar dados do cartão.");
        // setOpenSnackbar(true);
      }
    };

    fetchCartaoData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const idUsuario = localStorage.getItem("idUsuario") || sessionStorage.getItem("idUsuario");
    const idPrefeitura = localStorage.getItem("idPrefeitura") || sessionStorage.getItem("idPrefeitura"); // ⚠️ Pegando ID da prefeitura
    const idAdm = localStorage.getItem("idAdm") || sessionStorage.getItem("idAdm");
    const profile = localStorage.getItem("profile") || sessionStorage.getItem("profile");
    const nomePrefeitura = localStorage.getItem("nomePrefeitura") || sessionStorage.getItem("nomePrefeitura");

    if (token) {
      setTitle("G2 Abastecimento " + nomePrefeitura);
      setUserData({ token, idUsuario, idPrefeitura, idAdm, profile });

      // 🔹 Se o ID da prefeitura não estiver definido, peça para o usuário selecionar uma prefeitura antes de carregar os dados
      if (!idPrefeitura) {
        console.warn("Nenhuma prefeitura associada ao usuário ADM.");
        setLoading(false); // Para evitar loop de carregamento infinito
        return;
      }

      // 🔹 Carrega os dados da prefeitura após obter o ID
      setPrefeituraSelecionada(idPrefeitura);
      handleSelectPrefeitura(idPrefeitura);
    } else {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (userData?.token && userData?.idPrefeitura) {
      handleBuscarInfo();
    }
  }, [userData]);

  const handleBuscarInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Constants.API_BASE_URL}/api/listarPrefeitura/${userData.idPrefeitura}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          },
        }
      );

      const jsonData = response.data;

      if (jsonData.status) {
        const prefeitura = jsonData.prefeitura;
        const { PRE_ID, PRE_NOME, PRE_SALDO_ATUAL, PRE_EMAIL } = prefeitura;
        const endereco = prefeitura.endereco;
        const { END_CIDADE, END_ESTADO, END_CEP } = endereco;
        const contratos = prefeitura.contratos;
        const saldoContrato = contratos.length > 0 ? contratos[0].CON_SALDO_CONTRATO : "0.000";
        const cartoes = prefeitura.cartoes;
        const cartaoMaster = cartoes.find((cartao) => cartao.CAR_TIPO === "MASTER");

        if (cartaoMaster) {
          const saldosFixos = cartaoMaster.saldos.map((saldo) => ({
            tipo: saldo.combustivel.COM_DESCRICAO,
            valor: parseFloat(saldo.SAL_VALOR),
          }));
          setSaldosCombustiveis(saldosFixos);
        } else {
          setSaldosCombustiveis([]);
        }

        const saldoCartaoMaster = cartaoMaster?.saldos?.reduce((total, saldo) => total + parseFloat(saldo.SAL_VALOR), 0) || 0;
        const saldoNosCartoes = (parseFloat(PRE_SALDO_ATUAL) - saldoCartaoMaster).toFixed(3);

        setDados({
          prefeituraId: prefeitura.PRE_ID,
          nomePrefeitura: prefeitura.PRE_NOME,
          saldoAtual: prefeitura.PRE_SALDO_ATUAL,
          saldoLivre: saldoCartaoMaster.toFixed(3),
          saldoNosCartoes,
          emailPrefeitura: prefeitura.PRE_EMAIL,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      //  setSnackbarMessage("Erro ao buscar dados. Tente novamente.");
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


  const formatarMoeda = (valor) => {
    if (!valor) return "";

    // Remove tudo que não for número
    let numero = valor.replace(/\D/g, "");

    // Aplica formatação correta
    if (numero.length > 6) {
      // Milhões: separa casa dos milhões com ponto e milhar com vírgula
      numero = numero.replace(/^(\d+)(\d{3})(\d{3})$/, "$1.$2,$3");
    } else if (numero.length > 3) {
      // Milhares: separa com vírgula
      numero = numero.replace(/^(\d+)(\d{3})$/, "$1,$2");
    }

    return numero;
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
    setLoading(true);

    // console.log("Valor digitado (saldoText):", saldoText); // Verifique o valor digitado

    const valorConvertido = converterParaAPI(saldoText);
    //  console.log("Valor convertido para API:", valorConvertido); // Verifique o valor convertido
    // console.log("Tipo de valorConvertido:", typeof valorConvertido); // Verifique o tipo
    //  console.log("Valor é maior que zero?", valorConvertido > 0); // Verifique se o valor é maior que zero

    // Verificação adicional
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

    // Atualiza o saldoTransacao com o valorConvertido
    setSaldoTransacao(valorConvertido);

    // Monta o payload
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
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      });

      //  console.log("Resposta da API após transação:", response.data);

      if (response.data.status) {
        showSnackbar("Sucesso: " + response.data.message, "success");

        // Atualiza o estado local imediatamente
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
        // console.log("Saldos após atualização:", updatedSaldos);

        // Força a recarga dos dados da prefeitura selecionada
        if (prefeituraSelecionada) {
          await handleSelectPrefeitura(prefeituraSelecionada);
        }

        // Atualiza os saldos disponíveis
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
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          },
        }
      );

      if (response.data.status) {
        showSnackbar("Sucesso: " + response.data.message, "success");

        // Atualiza o estado local dos cartões
        const cartoesAtualizados = cartoes.map((cartao) => {
          if (cartao.id === idCartao) {
            return {
              ...cartao,
              status: dadosAlterado.CAR_STATUS || cartao.status, // Atualiza o status
            };
          }
          return cartao;
        });

        setCartoes(cartoesAtualizados); // Atualiza o estado dos cartões
        handleCancel(); // Limpa os campos selecionados
      }
    } catch (error) {
      console.error("Erro ao editar cartão:", error);
      showSnackbar("Erro ao editar informações do cartão. Tente novamente.", "error");
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

  const SelectCartoes = ({ cartaoSelecionado, cartoes, setCartaoSelecionado, title }) => {
    return (
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Select
          value={cartaoSelecionado}
          onChange={(event) => setCartaoSelecionado(event.target.value)}
          fullWidth
        >
          {cartoes.map((cartao) => (
            <MenuItem key={cartao.id} value={cartao}>
              {cartao.label} - Nº {cartao.num_cartao}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
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
    <MainLayout titlePage={title} loading={loading}>
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
        <Typography variant="h4" align="center">
          Gestão dos cartões e Saldos
        </Typography>
        <div>


          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>

        {/* Seleção da Prefeitura */}
        {/* Seleção da Prefeitura */}
        <Container maxWidth="md" sx={{ padding: "1% 1%" }}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
            <Box>
              <Typography variant="h6">Selecione uma Prefeitura:</Typography>
              <Autocomplete
                options={filteredPrefeituras}
                getOptionLabel={(option) => option.PRE_NOME}
                value={prefeituras.find((prefeitura) => prefeitura.PRE_ID === prefeituraSelecionada) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    handleSelectPrefeitura(newValue.PRE_ID);
                  } else {
                    // 🔹 Se a pesquisa for limpa, reseta os estados:
                    setPrefeituraSelecionada(null);
                    setDados(null);
                    setCartoes([]); // Remove os cartões carregados
                    setSaldosCombustiveis([]); // Limpa os saldos
                    setCartaoSelecionado(null); // Limpa o cartão selecionado
                    setModalOpen(false); // 🔹 Fecha o modal
                  }
                }}
                onInputChange={(_, newInputValue) => {
                  setSearchPrefeitura(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Prefeitura"
                    fullWidth
                    margin="normal"
                  />
                )}
              />

            </Box>
          </Paper>
        </Container>

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
          <Box //Container:  Gerenciamento da prefeitura
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              padding: isMobile ? 1 : 3,
              //backgroundColor: "#FFFFFF00", // Deixar fundo transparente.
              backgroundColor: "#f0f0f7",
            }}
          >
            <Box //Box header: Selecionando Cartão
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: isMobile ? "flex-end" : "space-between",
                flexWrap: "wrap",
                alignItems: "start",
              }}
            >
              <Box sx={{ width: isMobile ? "100%" : "none" }}>
                {/*Box Label+Select */}
                <Typography variant="h6">
                  Selecione um cartão para gerenciar
                </Typography>
                <SelectCartoes
                  cartaoSelecionado={cartaoSelecionado}
                  cartoes={cartoes}
                  setCartaoSelecionado={setCartaoSelecionado}
                  title="Cartões"
                />
              </Box>
              {cartaoSelecionado ? (
                <Box // ====== Informções sobre o cartão selecionado ======
                  sx={{
                    flex: isMobile ? 1 : 0.8,
                    backgroundColor: "#f5f5f5",
                    borderRadius: "12px",
                    padding: "6px",
                    boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="body1"
                    align="center"
                    fontWeight="bold"
                    color="primary"
                  >
                    Cartão Selecionado: Nº {cartaoSelecionado?.num_cartao}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      //marginTop: 1,
                      //gap: 1,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Setor:</strong> {cartaoSelecionado?.label} <br />
                      <strong>Responsável:</strong> {cartaoSelecionado?.nomeResponsavel} {/* responsavel */} <br />
                      <strong>Status:</strong>
                      {/* {statusCartao ? "Ativo" : "Bloqueado"} */}
                      {cartaoSelecionado?.status === "ATIVO" ? "Ativo" : "Bloqueado"}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <ModalGerarEditarCard  // ====== Modal Editar resposavel pelo cartão ======
              open={isModalOpen}
              onClose={handleCloseModalGerarEditarCard}
              mode={modalMode} //"gerar" // ou "editar"
              cardNumber={
                modalMode === "editar" ? cartaoSelecionado?.num_cartao : ""
              }
              initialData={cardData}
              onSubmit={handleSubmeterAlteracaoDeResponsavel}
            />
            {cartaoSelecionado ? (
              <Box>
                <Box>
                  <IconButton // ====== Editar resposavel pelo cartão ======
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
                <ModalConfirmacao // ====== Modal Bloquear/Desbloquear cartão ======
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
                <Box // ====== Saldos do cartão | Adicionar/Remover saldos ======
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
                  <Divider
                    sx={{
                      my: 2,
                      borderRadius: "10px",
                      borderBottomWidth: "medium",
                    }}
                  />
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
                            width: { xs: "100%", sm: "48%", md: "30%" }, // 3 por linha no desktop
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
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary"
                          >
                            {combustivel.tipo}
                          </Typography>
                          <Typography variant="body2">
                            {combustivel.valor}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                  <Divider
                    sx={{
                      my: 2,
                      borderRadius: "10px",
                      borderBottomWidth: "medium",
                    }}
                  />
                  <Typography variant="h6" align="center" fontWeight="bold">
                    Operações com o Cartão
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <RadioGroup
                      row={isMobile ? false : true}
                      name="row-radio-buttons-group"
                      value={selectedOption}
                      onChange={handleOptionChange}
                    >
                      <FormControlLabel
                        value="adicionarSaldo"
                        control={<Radio />}
                        label="Adicionar saldo"
                      />
                      {/* <FormControlLabel
                        value="transferirSaldo"
                        control={<Radio />}
                        label="Transferir Saldo"
                      /> */}
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
                        <Typography variant="subtitle1">
                          Selecione o Combustível:
                        </Typography>
                        <Select
                          value={selectedCombustivelparaSaldo}
                          onChange={handleChangeSelectCombustivel}
                          //label="Selecione o Combustível"
                          sx={{
                            width: isMobile ? "100%" : 320,
                          }}
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

                  {selectedOption === "transferirSaldo" && (
                    <Box sx={{ width: isMobile ? "100%" : "none" }}>
                      <TextField
                        label="Saldo R$"
                        value={saldoText}
                        onChange={handleChangeValor}
                        variant="outlined"
                        sx={{ width: isMobile ? "100%" : 320 }}
                        margin="normal"
                      />
                      <Typography variant="subtitle1">
                        Para o cartão:
                      </Typography>
                      <SelectCartoes
                        cartaoSelecionado={cartaoDestino}
                        cartoes={cartoes}
                        setCartaoSelecionado={setarCartaoDestino}
                        title="Cartão destinatário"
                      />
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
                        <Typography variant="subtitle1">
                          Selecione o Combustível:
                        </Typography>
                        <Select
                          value={selectedCombustivelparaSaldo}
                          onChange={handleChangeSelectCombustivel}
                          //label="Selecione o Combustível"
                          sx={{
                            width: isMobile ? "100%" : 320,
                          }}
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
                  <Box //Box Botões de controle: Salvar e Cancelar
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button
                      //type="submit"
                      variant="contained"
                      color="primary"
                      disabled={desabilitarSalvar}

                      onClick={adicionarRemoverSaldo}

                    >
                      {labelBotaoSalvar}
                    </Button>

                  </Box>
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}