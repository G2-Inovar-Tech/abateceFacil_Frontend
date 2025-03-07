import React, { useState, useEffect } from "react";
import Constants from "../components/Constant.js";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Grid,
  Autocomplete,
  Snackbar,
  Alert,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function VincularContratoPosto() {
  const [formData, setFormData] = useState({
    contrato: "",
    posto: "",
    saldoLimite: "",
  });

  const [errors, setErrors] = useState({});
  const [contratos, setContratos] = useState([]);
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [postos, setPostos] = useState([]);
  const [filteredPostos, setFilteredPostos] = useState([]);
  const [searchContrato, setSearchContrato] = useState("");
  const [searchPostos, setSearchPostos] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

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

  // Carrega os contratos da API
  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const response = await fetch(Constants.API_CONSULTAR_CONTRATO, {
          headers: {
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
          }
        });
        const data = await response.json();
        if (response.ok && data.contratos) {
          setContratos(data.contratos);
          setFilteredContratos(data.contratos);
        } else {
          showSnackbar("Erro ao buscar contratos.", "error");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
      }
    };
    fetchContratos();
  }, [token]);

  // Filtra os contratos com base na pesquisa
  useEffect(() => {
    if (searchContrato) {
      const filtered = contratos.filter((contrato) =>
        contrato.prefeitura.PRE_NOME && contrato.prefeitura.PRE_NOME.toLowerCase().includes(searchContrato.toLowerCase())
      );
      setFilteredContratos(filtered);
    } else {
      setFilteredContratos(contratos);
    }
  }, [searchContrato, contratos]);

  // Carrega os postos da API
  useEffect(() => {
    const fetchPostos = async () => {
      try {
        const response = await fetch(Constants.API_CONSULTAR_POSTO, {
          headers: {
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
          }
        });
        const data = await response.json();
        if (response.ok && data.postos) {
          setPostos(data.postos);
          setFilteredPostos(data.postos);
        } else {
          showSnackbar("Erro ao buscar postos.", "error");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
      }
    };
    fetchPostos();
  }, [token]);

  // Filtra os postos com base na pesquisa
  useEffect(() => {
    if (searchPostos) {
      const filtered = postos.filter((posto) =>
        posto.POS_RAZAO_SOCIAL && posto.POS_RAZAO_SOCIAL.toLowerCase().includes(searchPostos.toLowerCase())
      );
      setFilteredPostos(filtered);
    } else {
      setFilteredPostos(postos);
    }
  }, [searchPostos, postos]);

  // Valida o formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.contrato) newErrors.contrato = "Contrato é obrigatório.";
    if (!formData.posto) newErrors.posto = "Posto é obrigatório.";

    const saldoLimiteFormatted = formData.saldoLimite.replace(".", "").replace(",", ".");
    if (!formData.saldoLimite) {
      newErrors.saldoLimite = "Saldo Limite é obrigatório.";
    } else if (isNaN(saldoLimiteFormatted)) {
      newErrors.saldoLimite = "Saldo Limite deve ser um número.";
    }

    if (formData.contrato && !contratos.some((contrato) => contrato.CON_ID === formData.contrato)) {
      newErrors.contrato = "Contrato inválido.";
    }

    if (formData.posto && !postos.some((posto) => posto.POS_ID === formData.posto)) {
      newErrors.posto = "Posto inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia os dados do formulário para a API
// Envia os dados do formulário para a API
const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        COP_CON_ID: formData.contrato,
        COP_POS_ID: formData.posto,
        COP_SALDO_LIMITE: parseFloat(formData.saldoLimite.replace(".", "").replace(",", ".")),
      };
  
     // console.log("Dados enviados para a API:", requestData); // Depuração
  
      try {
        const response = await fetch(Constants.API_VINCULAR_CONTRATO_POSTO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
          },
          body: JSON.stringify(requestData),
        });
  
        const responseData = await response.json();
        //console.log("Resposta da API:", responseData); // Depuração
  
        if (response.ok) {
          showSnackbar(responseData.message || "Contrato vinculado com sucesso!", "success");
          handleCancel(); // Limpa o formulário após sucesso
        } else {
          // Verifica se há uma mensagem de erro específica
          let errorMessage = "Erro ao vincular contrato ao posto!";
  
          if (responseData.error) {
            // Se houver um erro específico, exibe ele
            errorMessage = responseData.error;
          } else if (responseData.message) {
            // Se houver uma mensagem de erro, exibe ela
            errorMessage = responseData.message;
          } else {
            // Se não houver uma mensagem clara, exibe a resposta completa para depuração
            errorMessage = `Erro desconhecido. Resposta da API: ${JSON.stringify(responseData)}`;
          }
  
          showSnackbar(`Erro: ${errorMessage}`, "error");
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
      }
    }
  };

  // Limpa o formulário
  const handleCancel = () => {
    setFormData({ contrato: "", posto: "", saldoLimite: "" });
    setErrors({});
    setSearchContrato("");
    setSearchPostos("");
  };

  // Atualiza o estado do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "saldoLimite") {
      // Remove tudo que não é número
      newValue = newValue.replace(/\D/g, "");

      // Se houver mais de três dígitos, separa os últimos três como decimais
      if (newValue.length > 3) {
        const integerPart = newValue.slice(0, -3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const decimalPart = newValue.slice(-3);
        newValue = `${integerPart},${decimalPart}`;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
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
              Vincular Contrato ao Posto
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={filteredContratos}
                    getOptionLabel={(option) => option.prefeitura.PRE_NOME || ""}
                    value={contratos.find((contrato) => contrato.CON_ID === formData.contrato) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, contrato: newValue ? newValue.CON_ID : "" }));
                    }}
                    onInputChange={(_, newInputValue) => {
                      setSearchContrato(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Contrato"
                        fullWidth
                        margin="normal"
                        error={!!errors.contrato}
                        helperText={errors.contrato}
                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    options={filteredPostos}
                    getOptionLabel={(option) => option.POS_RAZAO_SOCIAL || ""}
                    value={postos.find((posto) => posto.POS_ID === formData.posto) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, posto: newValue ? newValue.POS_ID : "" }));
                    }}
                    onInputChange={(_, newInputValue) => {
                      setSearchPostos(newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Posto"
                        fullWidth
                        margin="normal"
                        error={!!errors.posto}
                        helperText={errors.posto}
                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}> {/* Reduzi o tamanho do campo de saldo */}
                  <TextField
                    fullWidth
                    label="Saldo Limite"
                    name="saldoLimite"
                    value={formData.saldoLimite}
                    onChange={handleInputChange}
                    error={!!errors.saldoLimite}
                    helperText={errors.saldoLimite}
                    margin="normal"
                    type="text"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} fullWidth sx={{ height: "56px" }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ height: "56px" }}>
                  Vincular
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>

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