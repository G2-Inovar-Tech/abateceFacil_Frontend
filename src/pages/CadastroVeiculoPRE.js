import React, { useState, useEffect } from "react";
import Constants from "../components/Constant.js";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastroVeiculoPRE() {
  const [formData, setFormData] = useState({
    tipo: "CARRO",
    placa: "",
    renavam: "",
    chassi: "",
    descricao: "",
    capacidadeTanque: "",
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Obtém o ID da prefeitura do usuário logado
  const prefeituraId = obterPrefeituraIdDoUsuario(); // Implemente essa função conforme sua lógica

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "placa" || name === "chassi") {
      newValue = value.toUpperCase(); // Garantir que os valores de placa e chassi sejam sempre maiúsculos
    }

    if (name === "capacidadeTanque") {
      // Remove tudo que não é número
      newValue = newValue.replace(/\D/g, "");

      // Impede valores negativos
      if (newValue.startsWith("-")) newValue = newValue.slice(1);

      // Se houver mais de três dígitos, separa os últimos três como decimais
      if (newValue.length > 3) {
        const integerPart = newValue.slice(0, -3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const decimalPart = newValue.slice(-3);
        newValue = `${integerPart},${decimalPart}`;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.placa.trim()) newErrors.placa = "Placa é obrigatória.";
    if (!formData.renavam.trim()) newErrors.renavam = "Renavam é obrigatório.";
    if (!formData.chassi.trim()) newErrors.chassi = "Chassi é obrigatório.";
    if (!formData.capacidadeTanque.trim()) newErrors.capacidadeTanque = "Capacidade do tanque é obrigatória.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showSnackbar("Por favor, corrija os erros no formulário.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        VEI_TIPO: formData.tipo,
        VEI_PLACA: formData.placa,
        VEI_RENAVAM: formData.renavam,
        VEI_CHASSI: formData.chassi,
        VEI_DESCRICAO: formData.descricao,
        VEI_CAPACIDADE_TANQUE: parseFloat(formData.capacidadeTanque.replace(".", "").replace(",", ".")),
        VEI_STATUS: "ATIVO",
        VEI_PRE_ID: prefeituraId, 
      };

      try {
        const response = await fetch(Constants.API_CADASTRAR_VEICULO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          showSnackbar("Veículo cadastrado com sucesso!", "success");
          handleCancel(); // Limpa o formulário imediatamente
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          showSnackbar(`Erro ao cadastrar veículo: ${errorMessages}`, "error");
        }
      } catch (error) {
       //console.error("Erro ao enviar dados:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      tipo: "CARRO",
      placa: "",
      renavam: "",
      chassi: "",
      descricao: "",
      capacidadeTanque: "",
    });
    setErrors({});
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
              Cadastro de Veículo
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Tipo de Veículo e Placa */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Tipo de Veículo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                  >
                    <MenuItem value="CARRO">CARRO</MenuItem>
                    <MenuItem value="ÔNIBUS">ÔNIBUS</MenuItem>
                    <MenuItem value="CAMINHÃO">CAMINHÃO</MenuItem>
                    <MenuItem value="MÁQUINA">MÁQUINA</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Placa"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    error={!!errors.placa}
                    helperText={errors.placa}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                    inputProps={{ maxLength: 7 }}
                  />
                </Grid>

                {/* Renavam e Chassi */}
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Renavam"
                    name="renavam"
                    value={formData.renavam}
                    onChange={handleInputChange}
                    error={!!errors.renavam}
                    helperText={errors.renavam}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Chassi"
                    name="chassi"
                    value={formData.chassi}
                    onChange={handleInputChange}
                    error={!!errors.chassi}
                    helperText={errors.chassi}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                    inputProps={{ maxLength: 17 }}
                  />
                </Grid>

                {/* Descrição e Capacidade do Tanque */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descrição"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    error={!!errors.descricao}
                    helperText={errors.descricao}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Capacidade do Tanque (litros)"
                    name="capacidadeTanque"
                    value={formData.capacidadeTanque}
                    onChange={handleInputChange}
                    error={!!errors.capacidadeTanque}
                    helperText={errors.capacidadeTanque}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                    type="text"
                  />
                </Grid>
              </Grid>

              {/* Botões */}
              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} fullWidth sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, height: "56px" }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, height: "56px" }}>
                  Cadastrar
                </Button>
              </Box>
            </form>
          </Box>
        </Container>

        {/* Snackbar para exibir mensagens de sucesso e erro */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
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
      </Box>
    </MainLayout>
  );
}

// Função para obter o ID da prefeitura do usuário logado
function obterPrefeituraIdDoUsuario() {
  // Implemente a lógica para obter o ID da prefeitura do usuário logado
  // Exemplo: decodificar o token JWT ou fazer uma chamada à API
  return 1; // Substitua pelo ID real da prefeitura
}