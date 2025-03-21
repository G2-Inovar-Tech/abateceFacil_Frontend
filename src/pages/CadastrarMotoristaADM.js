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

export default function CadastrarMotoristaADM() {
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    prefeitura: "",
  });

  const [errors, setErrors] = useState({});
  const [prefeituras, setPrefeituras] = useState([]);
  const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
  const [searchPrefeitura, setSearchPrefeitura] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchPrefeituras = async () => {
      try {
        const response = await fetch(Constants.API_CONSULTAR_PREFEITURA, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "telefone") {
      // Remove tudo que não é número
      newValue = value.replace(/\D/g, "");
      
      // Formata o número de telefone
      if (newValue.length > 2) {
        newValue = `(${newValue.slice(0, 2)}) ${newValue.slice(2)}`;
      }
      if (newValue.length > 10) {
        newValue = `${newValue.slice(0, 10)}-${newValue.slice(10)}`;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.prefeitura) newErrors.prefeitura = "Prefeitura é obrigatória.";
    if (!formData.nome.trim()) newErrors.nome = "Nome do motorista é obrigatório.";
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório.";
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
        MOT_NOME: formData.nome,
        MOT_TELEFONE: formData.telefone.replace(/\D/g, ""), // Remove formatação antes de enviar
        //MOT_STATUS: "ATIVO",
        MOT_PRE_ID: formData.prefeitura,
      };

      try {
        const response = await fetch(Constants.API_CADASTRAR_MOTORISTA, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          showSnackbar("Motorista cadastrado com sucesso!", "success");
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          showSnackbar(`Erro ao cadastrar motorista: ${errorMessages}`, "error");
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        showSnackbar("Erro ao conectar com o servidor.", "error");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      nome: "",
      telefone: "",
      prefeitura: "",
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
              Cadastro de Motorista
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* Prefeitura */}
                <Grid item xs={12}>
                  <Autocomplete
                    options={filteredPrefeituras}
                    getOptionLabel={(option) => option.PRE_NOME}
                    value={prefeituras.find((pref) => pref.PRE_ID === formData.prefeitura) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, prefeitura: newValue ? newValue.PRE_ID : "" }));
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
                        error={!!errors.prefeitura}
                        helperText={errors.prefeitura}
                        size="medium"
                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                      />
                    )}
                  />
                </Grid>

                {/* Nome do Motorista */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome do Motorista"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    error={!!errors.nome}
                    helperText={errors.nome}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                  />
                </Grid>

                {/* Telefone */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    error={!!errors.telefone}
                    helperText={errors.telefone}
                    margin="normal"
                    size="medium"
                    sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                    inputProps={{ maxLength: 15 }}
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
