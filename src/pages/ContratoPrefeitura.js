import React, { useState, useEffect } from "react";
import Constants from "../components/Constant";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Autocomplete,
  Snackbar,
  Alert,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastrarContrato() {
  const [formData, setFormData] = useState({ prefeitura: "", saldos: {} });
  const [errors, setErrors] = useState({});
  const [prefeituras, setPrefeituras] = useState([]);
  const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
  const [searchPrefeitura, setSearchPrefeitura] = useState("");
  const [saldoTotal, setSaldoTotal] = useState(0); // Estado para armazenar o saldo total
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar o modal de confirmação
  const [saldoCartaoMaster, setSaldoCartaoMaster] = useState(null); // Estado para armazenar o saldo do cartão master
  const [saldosCombustiveis, setSaldosCombustiveis] = useState([]); // Estado para armazenar os saldos dos combustíveis

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const combustiveis = [
    { key: "0", valor: "" },
    { key: "1", valor: "Etanol" },
    { key: "2", valor: "Gasolina comum" },
    { key: "3", valor: "Gasolina aditivada" },
    { key: "4", valor: "Diesel S10" },
    { key: "5", valor: "Diesel S500" },
    { key: "6", valor: "Arla 32" },
  ];

  // Função para exibir mensagens no Snackbar
  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fecha o Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Carrega as prefeituras da API
  useEffect(() => {
    const fetchPrefeituras = async () => {
      try {
        const response = await fetch(Constants.API_CONSULTAR_PREFEITURA, {
          headers: {
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
          }
        });
        const data = await response.json();

        if (response.ok && Array.isArray(data.prefeituras)) {
          setPrefeituras(data.prefeituras);
          setFilteredPrefeituras(data.prefeituras);
        } else {
          showSnackbar("Erro ao buscar prefeituras.", "error");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
      }
    };
    fetchPrefeituras();
  }, [token]);

  // Filtra as prefeituras com base na pesquisa
  useEffect(() => {
    if (searchPrefeitura) {
      const filtered = prefeituras.filter((prefeitura) =>
        prefeitura.PRE_NOME.toLowerCase().includes(searchPrefeitura.toLowerCase())
      );
      setFilteredPrefeituras(filtered);
    } else {
      setFilteredPrefeituras(prefeituras);
    }
  }, [searchPrefeitura, prefeituras]);

  // Atualiza o estado do formulário e recalcula o saldo total
  const handleInputChange = (e, combustivelKey) => {
    const { value } = e.target;
    let newValue = value;

    // Remove tudo que não é número
    newValue = newValue.replace(/\D/g, "");

    // Se houver mais de três dígitos, separa os últimos três como decimais
    if (newValue.length > 3) {
      const integerPart = newValue.slice(0, -3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const decimalPart = newValue.slice(-3);
      newValue = `${integerPart},${decimalPart}`;
    }

    setFormData((prev) => ({
      ...prev,
      saldos: {
        ...prev.saldos,
        [combustivelKey]: newValue,
      },
    }));

    // Recalcula o saldo total
    const novosSaldos = { ...formData.saldos, [combustivelKey]: newValue };
    const total = Object.values(novosSaldos).reduce((acc, saldo) => {
      if (saldo) {
        const valorNumerico = parseFloat(saldo.replace(".", "").replace(",", "."));
        return acc + (isNaN(valorNumerico) ? 0 : valorNumerico);
      }
      return acc;
    }, 0);

    // Formata o total para ter 3 casas decimais
    const totalFormatado = parseFloat(total.toFixed(3)); // Garante 3 casas decimais
    setSaldoTotal(totalFormatado);
  };

  // Valida o formulário
  const validate = () => {
    const newErrors = {};
    if (!formData.prefeitura) newErrors.prefeitura = "Prefeitura é obrigatória.";

    // Validação dos saldos de combustíveis
    combustiveis.forEach((combustivel) => {
      if (combustivel.key !== "0" && (!formData.saldos[combustivel.key] || !/^\d{1,}(\.\d{3})*(,\d+)?$/.test(formData.saldos[combustivel.key]))) {
        newErrors[`saldo_${combustivel.key}`] = `Saldo de ${combustivel.valor} inválido (ex: 10.000,500).`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Busca o saldo do cartão master da prefeitura selecionada
  const buscarSaldoCartaoMaster = async () => {
    try {
      const response = await fetch(`${Constants.API_BASE_URL}/api/listarPrefeitura/${formData.prefeitura}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        const cartaoMaster = data.prefeitura.cartoes.find((cartao) => cartao.CAR_TIPO === "MASTER");
        if (cartaoMaster) {
          const saldosFixos = (cartaoMaster.saldos || []).map((saldo) => ({
            tipo: saldo.combustivel?.COM_DESCRICAO || "Tipo não disponível",
            valor: parseFloat(saldo.SAL_VALOR || 0),
          }));
          setSaldosCombustiveis(saldosFixos);

          const saldoCartaoMaster = saldosFixos.reduce((total, saldo) => total + saldo.valor, 0);
          setSaldoCartaoMaster(saldoCartaoMaster);
        } else {
          setSaldosCombustiveis([]);
          setSaldoCartaoMaster(0);
        }
      } else {
        showSnackbar("Erro ao buscar saldo do cartão master.", "error");
      }
    } catch (error) {
      console.error("Erro ao buscar saldo do cartão master:", error);
      showSnackbar("Erro ao conectar com o servidor.", "error");
    }
  };

  // Abre o modal de confirmação
  const abrirModalConfirmacao = async () => {
    if (validate()) {
      await buscarSaldoCartaoMaster(); // Busca o saldo do cartão master
      setModalOpen(true); // Abre o modal
    }
  };

  // Fecha o modal de confirmação
  const fecharModalConfirmacao = () => {
    setModalOpen(false);
  };

  const confirmarEnvio = async () => {
    fecharModalConfirmacao(); 
  
    
    const requestData = {
      CON_PRE_ID: Number(formData.prefeitura), 
      COMBUSTIVEIS: Object.keys(formData.saldos)
        .filter((key) => formData.saldos[key]) 
        .map((key) => ({
          COM_ID: Number(key), 
          SALDO: parseFloat(formData.saldos[key].replace(".", "").replace(",", ".")), 
        })),
    };
  
    //console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2)); 
  
    try {
      const response = await fetch(Constants.API_CADASTRAR_CONTRATO, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });
  
     // console.log("Resposta da API:", response); // Log da resposta
  
      const responseData = await response.json();
      //console.log("Resposta completa da API:", responseData); // Log da resposta completa
  
      if (response.ok) {
        showSnackbar(responseData.message || "Contrato Cadastrado!", "success");
        setFormData({ prefeitura: "", saldos: {} });
        setSaldoTotal(0); // Reseta o saldo total após o envio
      } else {
        const errorMessages = responseData.erros
          ? Object.values(responseData.erros).flat().join(", ")
          : "Erro desconhecido";
        showSnackbar(`Erro ao cadastrar Contrato: ${errorMessages}`, "error");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      showSnackbar("Erro ao conectar com o servidor.", "error");
    }
  };

  return (
    <MainLayout>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backgroundBlendMode: "overlay",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Cadastrar Contrato
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={filteredPrefeituras}
                    getOptionLabel={(option) => option.PRE_NOME || ""}
                    value={prefeituras.find((pref) => pref.PRE_ID === formData.prefeitura) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, prefeitura: newValue ? newValue.PRE_ID : "" }));
                    }}
                    onInputChange={(_, newInputValue) => setSearchPrefeitura(newInputValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Prefeitura"
                        fullWidth
                        margin="dense"
                        error={!!errors.prefeitura}
                        helperText={errors.prefeitura}
                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                      />
                    )}
                  />
                </Grid>

                {/* Campos de saldo para cada combustível */}
                {combustiveis.map((combustivel) => (
                  combustivel.key !== "0" && (
                    <Grid item xs={12} sm={6} key={combustivel.key}>
                      <TextField
                        label={`Saldo de ${combustivel.valor}`}
                        name={`saldo_${combustivel.key}`}
                        value={formData.saldos[combustivel.key] || ""}
                        onChange={(e) => handleInputChange(e, combustivel.key)}
                        error={!!errors[`saldo_${combustivel.key}`]}
                        helperText={errors[`saldo_${combustivel.key}`]}
                        margin="dense"
                        sx={{ width: "100%", "& .MuiInputBase-root": { height: "56px" } }}
                      />
                    </Grid>
                  )
                ))}

                {/* Exibição do saldo total */}
                <Grid item xs={12}>
                  <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                    Saldo Total: {saldoTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 3, // Garante 3 casas decimais
                      maximumFractionDigits: 3  // Limita a 3 casas decimais
                    })}
                  </Typography>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Button type="button" variant="outlined" color="secondary" onClick={() => { setFormData({ prefeitura: "", saldos: {} }); setSaldoTotal(0); }} fullWidth sx={{ height: "56px" }}>
                  Cancelar
                </Button>
                <Button type="button" variant="contained" color="primary" onClick={abrirModalConfirmacao} fullWidth sx={{ height: "56px" }}>
                  Cadastrar
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>

      {/* Modal de confirmação */}
      <Dialog open={modalOpen} onClose={fecharModalConfirmacao}>
        <DialogTitle>Confirmar Atualização de Saldos</DialogTitle>
        <DialogContent>
          <DialogContentText>
            O saldo atual do cartão master para esta prefeitura é:{" "}
            <strong>
              {saldoCartaoMaster?.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })}
            </strong>.
          </DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Saldos por combustível:
          </DialogContentText>
          <List>
            {saldosCombustiveis.map((saldo, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={saldo.tipo}
                  secondary={saldo.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 3,
                    maximumFractionDigits: 3,
                  })}
                />
              </ListItem>
            ))}
          </List>
          <DialogContentText sx={{ mt: 2 }}>
            Ao confirmar, os novos saldos serão atualizados. Deseja continuar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModalConfirmacao} color="secondary">
            Cancelar
          </Button>
          <Button onClick={confirmarEnvio} color="primary" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensagens de erro e sucesso */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
}