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
} from "@mui/material";
import {
  CreditCard as CardIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import MainLayout from "../components/MainLayout.js";
import SelectCartoes from "../components/SelectCartoes.js";
import ModalGerarEditarCard from "../components/ModalGerarEditarCard.js";
import ModalConfirmacao from "../components/ModalConfirmacao.js";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem
//import { styled } from "@mui/material/styles";

export default function GestaoDosSaldosECartoes() {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas
  
  const [cartoes, setCartoes] = useState([]);
  const [cartaoSelecionado, setCartaoSelecionado] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [desabilitarSalvar, setDesabilitarSalvar] = useState(true);
  const [labelBotaoSalvar, setLabelBotaoSalvar] = useState("Salva");
  
  const [saldoTransacao, setSaldoTransacao] = useState(0.0);
  const [cartaoDestino, setCartaoDestino] = useState();
  const [saldoText, setSaldoText] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("gerar"); // "gerar" ou "editar"
  const [cardData, setCardData] = useState(null);
  const [responsavel, setResponsavel] = useState("Fulano");
  const [statusCartao, setStatusCartao] = useState(true);
  const [isModalConfirmacaoOpen, setModalConfirmacaoOpen] = useState(false);

  const [selectedCombustivelparaSaldo, setSelectedCombustivelparaSaldo] = useState("");

const [saldosCombustiveis, setSaldosCombustiveis] = useState([]);





  const combustiveis = [
    { key: "0", valor: "" },
    { key: "1", valor: "Etanol" },
    { key: "2", valor: "Gasolina comum" },
    { key: "3", valor: "Gasolina aditivada" },
    { key: "4", valor: "Diesel S10" },
    { key: "5", valor: "Diesel S500" },
    { key: "6", valor: "ARLA32" },
  ];

  const handleChangeSelectCombustivel = (event) => {
    let valorSelecinado = event.target.value;
    if (valorSelecinado === ""){
      setDesabilitarSalvar(true);
    }
    if (saldoText !== "" && valorSelecinado !== "") {
      setDesabilitarSalvar(false);
    }
    setSelectedCombustivelparaSaldo(valorSelecinado);
  };

  const [title, setTitle] = useState("Abastece Fácil - Prefeitura de ...");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [dados, setDados] = useState(null);
  useEffect(() => {
    setLoading(true);
  
    setTimeout(() => {
      // Simulando os dados que viriam da API
      const saldosFake = [
        { tipo: "Etanol", valor: 1250.567 },
        { tipo: "Gasolina Comum", valor: 2340.750 },
        { tipo: "Gasolina Aditivada", valor: 980.324 },
        { tipo: "Diesel S10", valor: 3125.890 },
        { tipo: "Diesel S500", valor: 2100.432 },
        { tipo: "ARLA32", valor: 860.150 },
      ];
  
      // Atualiza o estado simulando resposta da API
      setSaldosCombustiveis(saldosFake);
      setLoading(false);
    }, 2000); // Simula um tempo de resposta de 2 segundos
  }, []);
  const calcularTotal = () => {
    return saldosCombustiveis
      .reduce((total, saldo) => total + saldo.valor, 0)
      .toFixed(3);
  };
  

  useEffect(() => { 
    if (userData?.token && userData?.idPrefeitura) {
      handleBuscarInfo();
    }
  },[userData]);

  const handleBuscarInfo = async () => {
    setLoading(true);
    try {
      console.log("Tentando conexão com o servidor...");
      const response = await axios.get(
        `https://g2inovartech.com.br/api/listarPrefeitura/${userData.idPrefeitura}`,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            "Accept": "*/*",
          }
        }
      );
  
      const jsonData = response.data;
  
      if (jsonData.status) {
        const prefeitura = jsonData.prefeitura;
        const cartaoMaster = prefeitura.cartoes.find(cartao => cartao.CAR_TIPO === "MASTER");
  
        // Criar os saldos fixos de combustível
        const saldosFixos = cartaoMaster?.saldos.map((saldo) => ({
          tipo: saldo.combustivel.COM_DESCRICAO,
          valor: parseFloat(saldo.SAL_VALOR),
        })) || [];
  
        setSaldosCombustiveis(saldosFixos);
      }
    } catch (error) {
      console.log("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
    console.log("Depois de conexão com o servidor...");
  };

  const handleCancel = () => {
    //setTitle("");
    setCartaoSelecionado();
    setSelectedOption("");
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino();
    setDesabilitarSalvar(true);
    setLabelBotaoSalvar("Salvar");
    setSelectedCombustivelparaSaldo("");
  };

  const handleOptionChange = (event) => {
    let opcao = event.target.value;
    setSelectedOption(opcao);
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino();
    setDesabilitarSalvar(true);
    setSelectedCombustivelparaSaldo("");
    
    if (opcao === "adicionarSaldo" || opcao === "removerSaldo")
      setLabelBotaoSalvar("Confirmar");
    if (opcao === "transferirSaldo")
      setLabelBotaoSalvar("Transferir");
  };

  const setarCartaoDestino = (texto) => {
    setCartaoDestino(texto);
    console.log(texto);
    if(saldoTransacao > 0 && texto)
      setDesabilitarSalvar(false);
    else
      setDesabilitarSalvar(true);
  };

  const ValidarCampoMoeda = (event) => {
    let inputValue = event.target.value; 
    inputValue = inputValue.replace(/[^\d,]/g, ""); // Remove qualquer caractere que não seja dígito ou vírgula.
    let indexVirgula = inputValue.indexOf(","); //Pega i index da primeira virgula.

    // Verifica se a string já tem alguma virgula e se o ultimo caractere é uma virgula. 
    if (indexVirgula !== inputValue.length-1  && inputValue.substr(inputValue.length-1).includes(","))  {
      inputValue = inputValue.slice(0, -1); //Se os dois forem positivos, remove a ultima virgula inserida.
    }
    // Impedir que o primeiro caractere seja uma virgula.
    if (inputValue.length <= 1 && inputValue.substr(inputValue.length-1).includes(",")) {
      inputValue = inputValue.slice(0, -1);
    }
    // Permitir apenas 3 digito apos a virgula, 3 casas decimais.
    if (inputValue.substr(indexVirgula).length > 4 ) {
      inputValue = inputValue.slice(0, -1);
    }
    // Se o valor for diferente de string vazia, adiciona o R$.
    if(inputValue !== "") {
      setSaldoText("R$ " + inputValue);
      let saldoString = inputValue.replace(",", ".");
      let saldo = Number.parseFloat(saldoString);//.toFixed(3);
      if (!isNaN(saldo) && saldo > 0){
        setSaldoTransacao(saldo);
        if (selectedOption === "adicionarSaldo" || selectedOption === "removerSaldo"){
          if (selectedCombustivelparaSaldo !== ""){
            setDesabilitarSalvar(false);
          }
        }
        else if (selectedOption === "transferirSaldo" && cartaoDestino) {
          if (selectedCombustivelparaSaldo !== "") {
            setDesabilitarSalvar(false);
          }
        }
      }
      else{
        setDesabilitarSalvar(true);
        setSaldoTransacao(0);
      }
    }
    else {
      setSaldoText("");
      setSaldoTransacao(0);
      setDesabilitarSalvar(true);
    }
  };

  const handleOpenModalGerarEditarCard = (mode, data = null) => { // Abrir modal Gerar/Editar cartão
    setModalMode(mode);
    setCardData(data);
    setModalOpen(true);
  };
  const handleCloseModalGerarEditarCard = () => setModalOpen(false); // Fecar modal Gerar/Editar cartão
  const handleSubmeterAlteracaoDeResponsavel = (formData) => { // Aplicar edição de cartão na propria pagina
    if (modalMode === "editar") {
      console.log("Dados recebidos do modal:", formData);
      editarCartao(false, formData?.responsavel);
    }
  };

  const handleOpenModalConfirmacao = () => setModalConfirmacaoOpen(true); // Abrir modal de confirmação
  const handleCloseModalConfirmacao = () => setModalConfirmacaoOpen(false); // Fechar modal de confirmação
  const handleModalConfirmacao = (confirmed) => { // Aplicar confirmação de (des)bloqueio de cartão
    if (confirmed) {
      editarCartao(true, "");
    }
  };

  const adicionarRemoverSaldo = async () => {
    setLoading(true);

    const tipoCombustivel = combustiveis
    .filter((combustivel) => combustivel.valor === selectedCombustivelparaSaldo)

    let url = "";
    if(selectedOption === "adicionarSaldo"){
      url = `https://g2inovartech.com.br/api/adicionarSaldo`;
    } else if (selectedOption === "removerSaldo") {
      url = `https://g2inovartech.com.br/api/retirarSaldo`;
    }
    try {
      console.log(userData?.idPrefeitura)
      console.log(saldoTransacao);
      console.log("Tentando conexão com o servidor...");
      const response = await axios.post(
        url,
        {
          TRA_ID_CARTAO_ORIGEM: Number.parseInt(cartaoSelecionado?.num_cartao), //Usado na remoção
          TRA_ID_CARTAO_DESTINO: Number.parseInt(cartaoSelecionado?.num_cartao), // Usando na adição
          TRA_COM_ID: Number.parseInt(tipoCombustivel[0]?.key),
          TRA_VALOR: saldoTransacao,
          TRA_USU_ID: Number.parseInt(userData.idUsuario),
          PRE_ID: dados.prefeituraId,
        },
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            "Accept": "*/*",
          }
        }
      );
      console.log("Depois de conexão com o servidor...");

      const jsonData = response.data;

      if (jsonData.status) {
        alert("Sucesso:\n" + jsonData.message);
        setTimeout(() => {
          // Espera 3 segundo para que os dados seja atualizado no servidor
          handleCancel();
          handleBuscarInfo();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Erro ao realizar transação de saldo no cartão. Tente novamente.";
      alert("Erro:\n" + errorMessage);
      console.log("Erro: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editarCartao = async (bloquear, nomeResponsavelAlterado) => {
    setLoading(true);
    let idCartao = Number.parseInt(cartaoSelecionado?.num_cartao);

    let dadosAlterado = {};

    if (bloquear) {
      let status = cartaoSelecionado?.status === "ATIVO"? "INATIVO" : "ATIVO"
      dadosAlterado = {
        CAR_STATUS: status,
      };
    }
    if (nomeResponsavelAlterado !== "") {
      dadosAlterado = {
        //CAR_ID_ORGAO_RESP: "",
        CAR_RESP_NOME: nomeResponsavelAlterado
      };
    }

    try {
      console.log(userData?.idPrefeitura)
      console.log(saldoTransacao);
      console.log("Tentando conexão com o servidor...");
      const response = await axios.put(
        `https://g2inovartech.com.br/api/cartao/${idCartao}`,
        dadosAlterado,
        {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            "Accept": "*/*",
          }
        }
      );
      console.log("Depois de conexão com o servidor...");

      const jsonData = response.data;

      if (jsonData.status) {
        alert("Sucesso:\n" + jsonData.message);

        setTimeout(() => {
          // Espera 3 segundo para que os dados seja atualizado no servidor
          handleCancel();
          handleBuscarInfo();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Erro ao editar informações do cartão. Tente novamente.";
      alert("Erro:\n" + errorMessage);
      console.log("Erro: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatarValor = (valor) => {
    if (typeof valor !== "string") {
      return valor;
    }
    
    // Substituir "." por "," na parte decimal
    let valorFormatado = valor.replace(".", ",");

    // Encontrar parte inteira e decimal
    let [parteInteira, parteDecimal] = valorFormatado.split(",");

    // Formatar a parte inteira com separador de milhar
    let parteInteiraFormatada = Number(parteInteira).toLocaleString("pt-BR");

    // Retorna número formatado
    return parteDecimal
      ? `${parteInteiraFormatada},${parteDecimal}`
      : parteInteiraFormatada;

    /**
     * Neste metodo não consigo garantir as 3 casas decimais mesmo usando .toFixed(3) 
     * return Number.parseFloat(valor).toLocaleString("pt-BR"); 
    */
  };

  const numeroCartaoFormatado = (numCartao) => {
    if(numCartao.length === 1)
      return "000" + numCartao;
    else if(numCartao.length === 2)
      return "00" + numCartao;
    else if(numCartao.length === 3)
      return "0" + numCartao;
    else
      return numCartao;
  };

  return (
    <MainLayout titlePage={title} loading={loading}>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          //backgroundSize: "cover", // Estica a imagem de background para ocupa todo espaço.
          //backgroundPosition: "center", // Centraliza a imagem do background.
          //backgroundRepeat: "no-repeat", // Deixa apenas uma imagem, sem repeti-la.
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
          backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
          padding: isMobile ? 1 : 3,
          borderRadius: 2,
          boxShadow: 3,
          //justifyContent: "center",
        }}
      >
        <Typography variant="h4" align="center">
          Gestão dos cartões e Saldos
        </Typography>
        <Container maxWidth="md" sx={{ padding: "1% 1%" }}>
  <Box sx={{ p: 4, justifyContent: "center", padding: 0 }}>
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, padding: "0.5% 0%" }}>
      <Typography variant="h6" align="center" fontWeight="bold">
        Saldos Disponíveis por Combustível
      </Typography>
      <Divider sx={{ my: 2, borderRadius: "10px", borderBottomWidth: "medium" }} />
      
      {loading ? (
        <Typography variant="body1" align="center">
          Carregando saldos...
        </Typography>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              justifyContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            {saldosCombustiveis.map((combustivel, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  boxShadow: "1px 1px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Typography variant="body1" color="primary">
                  {combustivel.tipo}
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  R$ {combustivel.valor.toFixed(3)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2, borderRadius: "10px", borderBottomWidth: "medium" }} />

          <Typography variant="h6" align="center" fontWeight="bold">
            Total: R$ {calcularTotal()}
          </Typography>
        </>
      )}
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
                  <FormControlLabel // ====== Bloquear/Desbloquear cartão ======
                    control={
                      <Checkbox
                        checked={!statusCartao}
                        onChange={handleOpenModalConfirmacao}
                        name="statusCartao"
                      />
                    }
                    label={
                      //statusCartao ? "Bloquear cartão" : "Cartão bloqueado"
                      cartaoSelecionado?.status === "ATIVO" ? "Bloquear cartão" : "Cartão bloqueado"
                    }
                  />
                </Box>
                <ModalConfirmacao // ====== Modal Bloquear/Desbloquear cartão ======
                  open={isModalConfirmacaoOpen}
                  onClose={handleCloseModalConfirmacao}
                  title="Confirmar Ação"
                  content={
                    statusCartao
                      ? "Você tem certeza que deseja realizar o BLOQUEIO do cartão?"
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
                    <Box sx={{display: "flex", justifyContent:"center"}}>
                      <Box sx={{display: "block"}}>
                        <TextField
                          label="Saldo R$"
                          value={saldoText}
                          onChange={ValidarCampoMoeda}
                          variant="outlined"
                          sx={{
                            width: isMobile ? "100%" : 320,
                          }}
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
                        onChange={ValidarCampoMoeda}
                        variant="outlined"
                        sx={{
                          width: isMobile ? "100%" : 320,
                        }}
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
                    <Box sx={{display: "flex", justifyContent:"center"}}>
                      <Box sx={{display: "block"}}>
                        <TextField
                          label="Saldo R$"
                          value={saldoText}
                          onChange={ValidarCampoMoeda}
                          variant="outlined"
                          sx={{
                            width: isMobile ? "100%" : 320,
                          }}
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
                      //type="submit"
                      variant="contained"
                      color="primary"
                      disabled={desabilitarSalvar}
                      onClick={adicionarRemoverSaldo}
                    >
                      {labelBotaoSalvar}
                    </Button>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                    >
                      Cancelar
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
