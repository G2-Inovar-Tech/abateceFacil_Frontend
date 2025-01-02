import React, { useState } from "react";
import {
  useMediaQuery,
  TextField,
  Paper,
  IconButton,
  Autocomplete,
  Button,
  Container,
  Box,
  Typography,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import {
  Search as SearchIcon,
  AddCard as AddCardIcon,
} from "@mui/icons-material";
import MainLayout from "../components/MainLayout.js";
import SelectCartoes from "../components/SelectCartoes.js";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem
import { styled } from "@mui/material/styles";

export default function GerenciarPrefeituras() {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas

   const Prefeituras = [
    { label: "Prefeitura de São Paulo", Codigo: 1995 },
    { label: "Prefeitura do Rio de Janeiro", Codigo: 1994 },
    { label: "Prefeitura de Jequié", Codigo: 1993 },
    { label: "Prefeitura do Rio de Contas", Codigo: 1972 },
    { label: "Prefeitura de Salvador", Codigo: 1974 },
    { label: "Prefeitura de Ipiaú", Codigo: 2008 },
    { label: "Prefeitura de Jitauna", Codigo: 1957 },
    { label: "Prefeitura de Itabuna", Codigo: 1993 },
    { label: "Prefeitura de Jaguaguara", Codigo: 1996 },
  ];

  const cartoes = [
    //Limitar Label dos cartões até no máximo 30 caracteres
    { label: "Geral", num_cartao: "**** **** **** **** 1234" },
    { label: "Secretaria da Saúde", num_cartao: "**** **** **** **** 2134" },
    {
      label: "Secretaria da Educação",
      num_cartao: "**** **** **** **** 3124",
    },
    {
      label: "Secretaria de infraestrutura qwe",
      num_cartao: "**** **** **** **** 4123",
    },
  ];

  const [title, setTitle] = useState("");
  const [prefeitura, setPrefeitura] = useState();
  const [cartaoSelecionado, setCartaoSelecionado] = useState();
  const [selectedOption, setSelectedOption] = useState("");
  const [desabilitarSalvar, setDesabilitarSalvar] = useState(true);
  const [labelBotaoSalvar, setLabelBotaoSalvar] = useState("Salva");
  
  const [saldoTransacao, setSaldoTransacao] = useState(0);
  const [cartaoDestino, setCartaoDestino] = useState();
  const [saldoText, setSaldoText] = useState("");

  const buscarPrefeitura = () => {
    // ToDo: Fazer as requisiçoes para buscar as informações da prefeitura.

    //if (prefeitura) setTitle("Gerenciando: " + prefeitura?.label);
    setCartaoSelecionado();
    if (prefeitura) {
      setTitle(prefeitura?.label);
    }
    else setTitle("");

    console.log("Você pesquisou por:", prefeitura);
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
  };

  const handleOptionChange = (event) => {
    let opcao = event.target.value;
    setSelectedOption(opcao);
    setSaldoText("");
    setSaldoTransacao(0);
    setCartaoDestino();
    setDesabilitarSalvar(true);
    
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

  return (
    <MainLayout titlePage={"Gerenciar Prefeituras"}>
      <Paper //Componente para buscar Prefeituras
        component="form"
        elevation={18}
        sx={{
          //p: "2px 4px",
          paddingRight: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          //width: 400,
          marginBottom: "20px",
          borderRadius: "15px",
        }}
      >
        <StyledAutocomplete
          disablePortal
          options={Prefeituras}
          value={prefeitura}
          onChange={(event, newValue) => {
            setPrefeitura(newValue);
          }}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label="Buscar Prefeitura"
              variant="filled"
            />
          )}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={buscarPrefeitura}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
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
        }}
      >
        {title ? ( //ToDo: Aparecer quando os dados da prefeitura forem buscados
          <>
            <Box //Nome da prefeitura e saldo geral
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5" component="h1" gutterBottom align="left">
                {title}
              </Typography>
              <Typography
                variant="h6"
                component="h1"
                gutterBottom
                align="right"
              >
                Saldo atual: R$ 1.000,00
              </Typography>
            </Box>
            <Container maxWidth="md" sx={{ padding: "5% 1%" }}>
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
                    flexWrap: "wrap-reverse",
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
                  <IconButton
                    type="button"
                    aria-label="Criar cartão"
                    color="primary"
                    size="small"
                    sx={{ p: "10px", maxHeight: "30px" }}
                    onClick={buscarPrefeitura}
                  >
                    <AddCardIcon sx={{ marginRight: "5px" }} />
                    {isMobile ? "" : "Criar novo cartão"}
                  </IconButton>
                </Box>
                {cartaoSelecionado ? (
                  <Box
                    sx={{
                      margin: "10px 0",
                      padding: "5px",
                      backgroundColor: "#FFFFFF",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography variant="h6" align="center">
                      Informações do cartão
                    </Typography>
                    <Divider sx={{ margin: "5px 0", borderRadius: "20px" }} />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="body1">
                        Número do cartão: 1234 5678 9123 4567 8912 <br />
                        Setor: {cartaoSelecionado.label} <br />
                        Responsavel: Fulano <br />
                        Status: Ativo
                      </Typography>
                      <Typography variant="body1" align="right">
                        Saldo do cartão: R$ 200,00 <br />
                      </Typography>
                    </Box>
                    <Divider
                      sx={{
                        margin: "5px 0",
                        borderRadius: "20px",
                        borderBottomWidth: "medium",
                      }}
                    />
                    <Typography variant="h6" align="center">
                      Operações com o cartão
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
                        <FormControlLabel
                          value="transferirSaldo"
                          control={<Radio />}
                          label="Transferir Saldo"
                        />
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
                ) : (
                  <></>
                )}
              </Box>
            </Container>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 4 }} color="gray">
              Busque uma prefeitura!
            </Typography>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-inputRoot": {
    borderRadius: "15px",
    borderColor: "black",
    borderWidth: "2px",
    backgroundColor: "white",
  },
  "& .MuiAutocomplete-label": {
    display: "none",
  },
  "& .css-113d811-MuiFormLabel-root-MuiInputLabel-root": {
    display: "none",
  },
  flexGrow: 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFilledInput-root": {
    "&::before, &::after": {
      borderBottom: "none",
    },
    "&:hover:not(.Mui-disabled, .Mui-error):before": {
      borderBottom: "none",
    },
    "&.Mui-focused:after": {
      borderBottom: "none",
    },
  },
}));
