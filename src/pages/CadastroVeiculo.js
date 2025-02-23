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

export default function CadastroVeiculo() {
  const [formData, setFormData] = useState({
    tipo: "CARRO",
    placa: "",
    renavam: "",
    chassi: "",
    descricao: "",
    capacidadeTanque: "",
    prefeitura: "",
  });

  const [errors, setErrors] = useState({});
  const [prefeituras, setPrefeituras] = useState([]);
  const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
  const [searchPrefeitura, setSearchPrefeitura] = useState("");

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
    let newValue = value;
    if (name === "placa" || name === "chassi") {
      newValue = value.toUpperCase();
    }
    if (name === "capacidadeTanque") {
      newValue = value.replace(",", ".");
    }
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.prefeitura) newErrors.prefeitura = "Prefeitura é obrigatória.";
    if (!formData.placa.trim()) newErrors.placa = "Placa é obrigatória.";
    if (!formData.renavam.trim()) newErrors.renavam = "Renavam é obrigatório.";
    if (!formData.chassi.trim()) newErrors.chassi = "Chassi é obrigatório.";
    if (!formData.capacidadeTanque.trim()) newErrors.capacidadeTanque = "Capacidade do tanque é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        VEI_CAPACIDADE_TANQUE: parseFloat(formData.capacidadeTanque),
        VEI_STATUS: "ATIVO",
        VEI_PRE_ID: formData.prefeitura, // Adicionando o ID da prefeitura
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/veiculo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Veículo cadastrado com sucesso!");
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao cadastrar veículo: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
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
      prefeitura: "",
    });
    setErrors({});
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
              Cadastro de Veículo
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
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
                <Grid item xs={6}>
                <TextField
                    select
                    fullWidth
                    label="Tipo de Veículo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    margin="normal"
                  >
                    <MenuItem value="CARRO">CARRO</MenuItem>
                    <MenuItem value="ÔNIBUS">ÔNIBUS</MenuItem>
                    <MenuItem value="CAMINHÃO">CAMINHÃO</MenuItem>
                    <MenuItem value="MÁQUINA">MÁQUINA</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Placa"
                    name="placa"
                    value={formData.placa}
                    onChange={handleInputChange}
                    error={!!errors.placa}
                    helperText={errors.placa}
                    margin="normal"
                    inputProps={{ maxLength: 7 }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Renavam"
                    name="renavam"
                    value={formData.renavam}
                    onChange={handleInputChange}
                    error={!!errors.renavam}
                    helperText={errors.renavam}
                    margin="normal"
                    inputProps={{ maxLength: 11 }}
                  />
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    fullWidth
                    label="Chassi"
                    name="chassi"
                    value={formData.chassi}
                    onChange={handleInputChange}
                    error={!!errors.chassi}
                    helperText={errors.chassi}
                    margin="normal"
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
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Capacidade do Tanque (litros)"
                    name="capacidadeTanque"
                    value={formData.capacidadeTanque}
                    onChange={handleInputChange}
                    error={!!errors.capacidadeTanque}
                    helperText={errors.capacidadeTanque}
                    margin="normal"
                    type="text"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Cadastrar
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}