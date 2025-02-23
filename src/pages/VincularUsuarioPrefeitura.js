import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  MenuItem,
  Grid,
  Autocomplete,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function VincularUsuarioPrefeitura() {
  const [formData, setFormData] = useState({
    usuario: "",
    prefeitura: "",
  });

  const [errors, setErrors] = useState({});
  const [usuarios, setUsuarios] = useState([]);
  const [prefeituras, setPrefeituras] = useState([]);
  const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
  const [searchPrefeitura, setSearchPrefeitura] = useState("");

  // Busca os usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/usuarios");
        const data = await response.json();
        if (response.ok) {
          setUsuarios(data.usuarios);
        } else {
          alert("Erro ao buscar usuários");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };
    fetchUsuarios();
  }, []);

  // Busca as prefeituras
  useEffect(() => {
    const fetchPrefeituras = async () => {
      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/prefeitura");
        const data = await response.json();
        if (response.ok) {
          setPrefeituras(data.prefeituras);
          setFilteredPrefeituras(data.prefeituras);
        } else {
          alert("Erro ao buscar prefeituras");
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };
    fetchPrefeituras();
  }, []);

  // Filtra as prefeituras com base no valor digitado
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.usuario) newErrors.usuario = "Usuário é obrigatório.";
    if (!formData.prefeitura) newErrors.prefeitura = "Prefeitura é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const requestData = {
        usuarioId: formData.usuario,
        prefeituraId: formData.prefeitura,
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/vincularUsuarioPrefeitura", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Vinculação realizada com sucesso!");
        } else {
          alert("Erro ao vincular usuário à prefeitura.");
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
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
              Vincular Usuário à Prefeitura
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete
                    options={usuarios}
                    getOptionLabel={(option) => option.nome}
                    value={usuarios.find((user) => user.id === formData.usuario) || null}
                    onChange={(_, newValue) => {
                      setFormData((prev) => ({ ...prev, usuario: newValue ? newValue.id : "" }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Usuário"
                        fullWidth
                        margin="normal"
                        error={!!errors.usuario}
                        helperText={errors.usuario}
                      />
                    )}
                  />
                </Grid>
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
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button type="button" variant="outlined" color="secondary">
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Vincular
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
