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
  
  const cartoes = [
    //Limitar Label dos cartões até no máximo 30 caracteres
    { label: "Geral", num_cartao: "1234" },
    { label: "Secretaria da Saúde", num_cartao: "2134" },
    {
      label: "Secretaria da Educação",
      num_cartao: "3124",
    },
    {
      label: "Secretaria de infraestrutura qwe",
      num_cartao: "4123",
    },
  ];

  const [cartaoSelecionado, setCartaoSelecionado] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [desabilitarSalvar, setDesabilitarSalvar] = useState(true);
  const [labelBotaoSalvar, setLabelBotaoSalvar] = useState("Salva");
  
  const [saldoTransacao, setSaldoTransacao] = useState(0);
  const [cartaoDestino, setCartaoDestino] = useState();
  const [saldoText, setSaldoText] = useState("");

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("gerar"); // "gerar" ou "editar"
  const [cardData, setCardData] = useState(null);
  const [responsavel, setResponsavel] = useState("Fulano");
  const [statusCartao, setStatusCartao] = useState(true);
  const [isModalConfirmacaoOpen, setModalConfirmacaoOpen] = useState(false);

  const [selectedValue, setSelectedValue] = useState("");

  const combustiveis = [
    { key: "1", valor: "Etanol" },
    { key: "2", valor: "Gasolina comum" },
    { key: "3", valor: "Gasolina aditivada" },
    { key: "4", valor: "Diesel S10" },
    { key: "5", valor: "Diesel S500" },
    { key: "6", valor: "ARLA32" },
  ];

  const handleChangeSelectCombustivel = (event) => {
    setSelectedValue(event.target.value);
  };

  const [title, setTitle] = useState("Abastece Fácil - Prefeitura de ...");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const idUsuario = localStorage.getItem("idUsuario") || sessionStorage.getItem("idUsuario");
    const idPrefeitura = localStorage.getItem("idPrefeitura") || sessionStorage.getItem("idPrefeitura");
    const idAdm = localStorage.getItem("idAdm") || sessionStorage.getItem("idAdm"); //Remover desta pagina
    const profile = localStorage.getItem("profile") || sessionStorage.getItem("profile");
    const nomePrefeitura = localStorage.getItem("nomePrefeitura") || sessionStorage.getItem("nomePrefeitura");
    // if (token) {
    //   setUserData({ token, idUsuario, idPrefeitura, idAdm, profile });
    // }
    setTimeout(() => { // Simula um atraso de 1 segundos para carregar os dados
      if (token) {
        setTitle("Abastece Fácil - Prefeitura de " + nomePrefeitura);
        setUserData({ token, idUsuario, idPrefeitura, idAdm, profile });
      }
    }, 1000); 
  }, []);

  useEffect(() => { 
    if (userData?.token && userData?.idPrefeitura) {
      handleBuscarInfo();
    }
  },[userData]);

  const handleBuscarInfo = async () => {
    setLoading(true);
    try {
      console.log(userData?.idPrefeitura)
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
      console.log("Depois de conexão com o servidor...");

      const jsonData = response.data;

        if (jsonData.status) {
          // Extraindo dados da prefeitura
          const prefeitura = jsonData.prefeitura;
          const { PRE_ID, PRE_NOME, PRE_SALDO_ATUAL, PRE_EMAIL } = prefeitura;

          // Extraindo endereço
          const endereco = prefeitura.endereco;
          const { END_CIDADE, END_ESTADO, END_CEP } = endereco;

          // Extraindo contratos
          const contratos = prefeitura.contratos;
          const saldoContrato = contratos.length > 0 ? contratos[0].CON_SALDO_CONTRATO : "0.000";

          // Extraindo cartões
          const cartoes = prefeitura.cartoes;
          const primeiroCartao = cartoes.length > 0 ? cartoes[0] : null;
          const quantidadeCartoes = cartoes?.length;

          // Extraindo saldos do primeiro cartão
          const saldos = primeiroCartao ? primeiroCartao.saldos : [];
          const saldoTotalPrimeiroCartao = saldos.reduce((acc, saldo) => acc + parseFloat(saldo.SAL_VALOR), 0);

          // Salvando no estado
          setDados({
            prefeituraId: PRE_ID,
            nomePrefeitura: PRE_NOME,
            saldoAtual: PRE_SALDO_ATUAL,
            emailPrefeitura: PRE_EMAIL,
            cidade: END_CIDADE,
            estado: END_ESTADO,
            cep: END_CEP,
            saldoContrato,
            primeiroCartao,
            saldoTotalPrimeiroCartao,
            quantidadeCartoes,
          });
        }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Erro ao buscar dados. Tente novamente.";
      alert("Erro:\n" + errorMessage);
      console.log("Erro: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // setTimeout(() => { // Simula um atraso de 1 segundos para carregar os dados
  //     setTitle("Abastece Fácil - Prefeitura de " + "Abaira");
  //     setLoading(false);
  // }, 1000);

  const handleCancel = () => {
    //setTitle("");
    setCartaoSelecionado();
    setSelectedOption("");
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino();
    setDesabilitarSalvar(true);
    setLabelBotaoSalvar("Salvar");
    setSelectedValue("");
  };

  const handleOptionChange = (event) => {
    let opcao = event.target.value;
    setSelectedOption(opcao);
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino();
    setDesabilitarSalvar(true);
    setSelectedValue("");
    
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
      let saldo = parseFloat(inputValue);
      if (!isNaN(saldo) && saldo > 0){
        setSaldoTransacao(saldo);
        if (selectedOption === "adicionarSaldo" || selectedOption === "removerSaldo")
          setDesabilitarSalvar(false);
        if (selectedOption === "transferirSaldo" && cartaoDestino)
          setDesabilitarSalvar(false);
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
  const handleFormSubmit = (formData) => { // Aplicar edição de cartão na propria pagina
    if (modalMode === "editar") {
      console.log("Dados recebidos do modal:", formData);
      setResponsavel(formData?.responsavel);
      setCartaoSelecionado({
        label: formData?.setor,
        num_cartao: cartaoSelecionado?.num_cartao,
      });
    }
  };

  const handleOpenModalConfirmacao = () => setModalConfirmacaoOpen(true); // Abrir modal de confirmação
  const handleCloseModalConfirmacao = () => setModalConfirmacaoOpen(false); // Fechar modal de confirmação
  const handleModalConfirmacao = (confirmed) => { // Aplicar confirmação de (des)bloqueio de cartão
    if (confirmed) {
      setStatusCartao(!statusCartao);
      console.log("Ação confirmada!");
    }
  };

  const formatarValor = (valor) => {
    return typeof valor === "string" ? valor.replace(".", ",") : valor;
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
            <Paper
              elevation={3}
              sx={{ p: 3, borderRadius: 2, padding: "0.5% 0%" }}
            >
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-around"
                alignItems="center"
                textAlign="center"
              >
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="primary">
                    Saldo de contrato restante:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    R$ 155.000,00
                  </Typography>
                </Box>
                <Box //Linha vertical (não exibe no mobile)
                  sx={{
                    display: { xs: "none", md: "block" },
                    height: "40px",
                    borderLeft: "2px solid #ccc",
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="primary">
                    Saldo livre:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    R$ 1.000,00
                  </Typography>
                </Box>
                <Box //Linha vertical (não exibe no mobile)
                  sx={{
                    display: { xs: "none", md: "block" },
                    height: "40px",
                    borderLeft: "2px solid #ccc",
                  }}
                />
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" color="primary">
                    Saldos nos cartões:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    R$ 1.000,00
                  </Typography>
                </Box>
              </Stack>
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
                // <Box
                //   sx={{
                //     flex: 0.8,
                //     backgroundColor: "#dddddd",
                //     borderRadius: 5,
                //     padding: 1,
                //   }}
                // >
                //   <Typography variant="body1" align="center">
                //     Cartão selecionado: Nº {cartaoSelecionado?.num_cartao}
                //   </Typography>
                //   <Box
                //     sx={{
                //       display: "flex",
                //       flexDirection: "row",
                //       justifyContent: "space-between",
                //     }}
                //   >
                //     <Typography variant="body2">
                //       Setor: {cartaoSelecionado?.label} <br />
                //       Responsável: {responsavel} <br />
                //       Status: {statusCartao ? "Ativo" : "Bloqueado"}
                //     </Typography>
                //   </Box>
                // </Box>
                <Box
                  sx={{
                    flex: 0.8,
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
                      <strong>Responsável:</strong> {responsavel} <br />
                      <strong>Status:</strong>
                      {statusCartao ? "Ativo" : "Bloqueado"}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <ModalGerarEditarCard
              open={isModalOpen}
              onClose={handleCloseModalGerarEditarCard}
              mode={modalMode} //"gerar" // ou "editar"
              cardNumber={
                modalMode === "editar" ? cartaoSelecionado?.num_cartao : ""
              }
              initialData={cardData}
              onSubmit={handleFormSubmit}
            />
            {cartaoSelecionado ? (
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
                        responsavel: responsavel,
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
                        checked={!statusCartao}
                        onChange={handleOpenModalConfirmacao}
                        name="statusCartao"
                      />
                    }
                    label={
                      statusCartao ? "Bloquear cartão" : "Cartão bloqueado"
                    }
                  />
                </Box>
                <ModalConfirmacao
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
                <Box
                  sx={{
                    margin: "10px 0",
                    padding: "5px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "5px",
                  }}
                >
                  {/* <Typography variant="h6" align="center">
                    Saldos do cartão
                  </Typography>
                  <Divider sx={{ margin: "5px 0", borderRadius: "20px" }} />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  > */}
                  {/* <Typography variant="body1">
                      Número do cartão: {cartaoSelecionado?.num_cartao} <br />
                      Setor: {cartaoSelecionado?.label} <br />
                      Responsável: {responsavel} <br />
                      Status: {statusCartao ? "Ativo" : "Bloqueado"}
                    </Typography> */}
                  {/* <Typography variant="body1" align="right">
                      Etanol: R$ 200,00 <br />
                      Gasolina comum: R$ 200,00 <br />
                      Gasolina aditivada: R$ 200,00 <br />
                      Diesel S10: R$ 200,00 <br />
                      Diesel S500: R$ 200,00 <br />
                      ARLA32: R$ 200,00 <br />
                    </Typography>
                  </Box>
                  <Divider
                    sx={{
                      margin: "5px 0",
                      borderRadius: "20px",
                      borderBottomWidth: "medium",
                    }}
                  /> */}
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
                      {[
                        { tipo: "Etanol", valor: "R$ 100,00" },
                        { tipo: "Gasolina comum", valor: "R$ 100,00" },
                        { tipo: "Gasolina aditivada", valor: "R$ 100,00" },
                        { tipo: "Diesel S10", valor: "R$ 100,00" },
                        { tipo: "Diesel S500", valor: "R$ 100,00" },
                        { tipo: "ARLA32", valor: "R$ 100,00" },
                      ].map((combustivel, index) => (
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
                  {/* <Typography variant="h6" align="center">
                    Operações com o cartão
                  </Typography> */}
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
                    <Box>
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
                        value={selectedValue}
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
                    <Box>
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
                        value={selectedValue}
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
                  )}
                  <Box //Box Botões de controle: Salvar e Cancelar
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={desabilitarSalvar}
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
