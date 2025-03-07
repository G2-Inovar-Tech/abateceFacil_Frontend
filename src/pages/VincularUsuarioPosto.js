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

export default function VincularUsuarioPosto() {
  const [formData, setFormData] = useState({ usuario: "", posto: "" });
  const [errors, setErrors] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [postos, setPostos] = useState([]);
  const [filteredPostos, setFilteredPostos] = useState([]);
  const [searchUsuario, setSearchUsuario] = useState("");
  const [searchPosto, setSearchPosto] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  // Carrega os usuários da API
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(Constants.API_CONSULTAR_USUARIO, {
          headers: {
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
          }
        });
        const data = await response.json();
        if (response.ok && data.users) {
          setUsuarios(data.users);
          setFilteredUsuarios(data.users);
        } else {
          setSnackbarMessage("Erro ao buscar usuários.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        setSnackbarMessage("Erro ao conectar com o servidor.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchUsuarios();
  }, [token]);

  // Filtra os usuários com base na pesquisa
  useEffect(() => {
    if (searchUsuario) {
      const filtered = usuarios.filter((usuario) =>
        usuario.USU_NOME.toLowerCase().includes(searchUsuario.toLowerCase())
      );
      setFilteredUsuarios(filtered);
    } else {
      setFilteredUsuarios(usuarios);
    }
  }, [searchUsuario, usuarios]);

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
          setSnackbarMessage("Erro ao buscar postos.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
        setSnackbarMessage("Erro ao conectar com o servidor.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };
    fetchPostos();
  }, [token]);

  // Filtra os postos com base na pesquisa
  useEffect(() => {
    if (searchPosto) {
      const filtered = postos.filter((posto) =>
        posto.POS_RAZAO_SOCIAL &&
        searchPosto &&
        posto.POS_RAZAO_SOCIAL.toLowerCase().includes(searchPosto.toLowerCase())
      );
      setFilteredPostos(filtered);
    } else {
      setFilteredPostos(postos);
    }
  }, [searchPosto, postos]);

  // Valida o formulário
  const validateForm = () => {
    const newErrors = {};
    if (!formData.usuario) newErrors.usuario = "Usuário é obrigatório.";
    if (!formData.posto) newErrors.posto = "Posto é obrigatório.";

    if (formData.usuario && !usuarios.some((user) => user.USU_ID === formData.usuario)) {
      newErrors.usuario = "Usuário inválido.";
    }

    if (formData.posto && !postos.some((posto) => posto.POS_ID === formData.posto)) {
      newErrors.posto = "Posto inválido.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envia os dados do formulário para a API
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      if (!formData.usuario) {
        setSnackbarMessage("Erro: O usuário não foi selecionado corretamente.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
  
      const requestData = {
        POS_USU_ID: formData.usuario,
        POS_USU_POS_ID: formData.posto,
      };
  
      try {
        const response = await fetch(Constants.API_VINCULAR_USUARIO_POSTO, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
          },
          body: JSON.stringify(requestData),
        });
  
        const responseData = await response.json();
  
        if (response.ok) {
          setSnackbarMessage(responseData.message || "Usuário vinculado com sucesso!");
          setSnackbarSeverity("success");
          setSnackbarOpen(true);
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : responseData.message || "Erro desconhecido";
          setSnackbarMessage(`Erro ao vincular usuário: ${errorMessages}`);
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      } catch (error) {
        console.error("Erro ao enviar requisição:", error);
        setSnackbarMessage("Erro ao conectar com o servidor.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  // Limpa o formulário
  const handleCancel = () => {
    setFormData({ usuario: "", posto: "" });
    setErrors({});
    setSearchUsuario("");
    setSearchPosto("");
  };

  // Fecha o Snackbar
  const handleCloseSnackbar = () => {
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
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Vincular Usuário ao Posto
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={filteredUsuarios}
                    getOptionLabel={(option) => option.USU_NOME || ""}
                    value={usuarios.find((user) => user.USU_ID === formData.usuario) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, usuario: newValue ? newValue.USU_ID : "" }));
                    }}
                    onInputChange={(_, newInputValue) => setSearchUsuario(newInputValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Usuário"
                        fullWidth
                        margin="normal"
                        error={!!errors.usuario}
                        helperText={errors.usuario}
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
                    onInputChange={(_, newInputValue) => setSearchPosto(newInputValue)}
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