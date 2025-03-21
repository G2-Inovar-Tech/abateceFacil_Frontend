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
  Autocomplete,
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

  const [orgaos, setOrgaos] = useState([]); // Inicializa como array vazio
  const [orgaoSelecionado, setOrgaoSelecionado] = useState("");
  const [filteredOrgaos, setFilteredOrgaos] = useState([]); // Novo estado para órgãos filtrados
  const [searchOrgao, setSearchOrgao] = useState(""); // Novo estado para busca de órgão
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const prefeituraId = localStorage.getItem("prefeituraId") || sessionStorage.getItem("prefeituraId");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchOrgaos = async () => {
      try {
        const response = await fetch(`${Constants.API_CONSULTAR_ORGAO}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Dados recebidos da API:", data);
          
          // Processa os dados considerando os diferentes formatos possíveis
          let orgaosArray = [];
          if (Array.isArray(data)) {
            orgaosArray = data;
          } else if (data.orgaos && Array.isArray(data.orgaos)) {
            orgaosArray = data.orgaos;
          } else if (data.data && Array.isArray(data.data)) {
            orgaosArray = data.data;
          }
          
          console.log("Array de órgãos processado:", orgaosArray);
          setOrgaos(orgaosArray);
        } else {
          console.error("Erro na resposta da API:", response.status);
          showSnackbar("Erro ao buscar a lista de órgãos.", "error");
          setOrgaos([]);
        }
      } catch (error) {
        console.error("Erro ao buscar órgãos:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
        setOrgaos([]);
      }
    };

    fetchOrgaos();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "placa" || name === "chassi") {
      newValue = value.toUpperCase(); 
    }

    if (name === "capacidadeTanque") {
      newValue = newValue.replace(/\D/g, "");
      if (newValue.startsWith("-")) newValue = newValue.slice(1);
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
    //if (!formData.capacidadeTanque.trim()) newErrors.capacidadeTanque = "Capacidade do tanque é obrigatória.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showSnackbar("Por favor, corrija os erros no formulário.", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prefeituraId) {
      showSnackbar("ID da prefeitura não encontrado. Por favor, faça login novamente.", "error");
      return;
    }

    if (!orgaoSelecionado) {
      showSnackbar("Por favor, selecione um órgão.", "error");
      return;
    }

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
        VEI_ORG_ID: orgaoSelecionado,
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
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          showSnackbar(`Erro ao cadastrar veículo: ${errorMessages}`, "error");
        }
      } catch (error) {
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
    setOrgaoSelecionado("");
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
                    <MenuItem value="MOTO">MOTO</MenuItem>
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

                {/* Campo de Órgão */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    fullWidth
                    options={orgaos}
                    getOptionLabel={(option) => 
                      option ? `${option.ORG_SIGLA} - ${option.ORG_DESCRICAO}` : ""
                    }
                    value={orgaos.find(orgao => orgao.ORG_ID === orgaoSelecionado) || null}
                    onChange={(_, newValue) => {
                      setOrgaoSelecionado(newValue ? newValue.ORG_ID : "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Órgão"
                        fullWidth
                        margin="normal"
                        error={!!errors.orgao}
                        helperText={errors.orgao}
                        size="medium"
                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <strong>{option.ORG_SIGLA}</strong> - {option.ORG_DESCRICAO}
                      </li>
                    )}
                    filterOptions={(options, { inputValue }) => {
                      const filterValue = inputValue.toLowerCase();
                      return options.filter(
                        option => 
                          option.ORG_SIGLA.toLowerCase().includes(filterValue) ||
                          option.ORG_DESCRICAO.toLowerCase().includes(filterValue)
                      );
                    }}
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