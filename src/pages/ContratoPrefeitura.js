import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  Autocomplete,
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import backgroundImage from "../assets/backgroundHome.png";

export default function ContratoPrefeitura() {
  const [formData, setFormData] = useState({ prefeitura: "", saldo: "" });
  const [errors, setErrors] = useState({});
  const [prefeituras, setPrefeituras] = useState([]);
  const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
  const [searchPrefeitura, setSearchPrefeitura] = useState("");

  useEffect(() => {
    const fetchPrefeituras = async () => {
      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/prefeitura");
        const data = await response.json();
        
        if (response.ok && Array.isArray(data.prefeituras)) {
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

  const validate = () => {
    const newErrors = {};
    if (!formData.prefeitura) newErrors.prefeitura = "Prefeitura é obrigatória.";
    if (!formData.saldo || isNaN(formData.saldo) || Number(formData.saldo) <= 0)
      newErrors.saldo = "Saldo deve ser um número positivo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const requestData = {
        CON_PRE_ID: formData.prefeitura,
        CON_SALDO_CONTRATO: formData.saldo,
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/contrato", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "*/*" },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Contrato Cadastrado!");
          setFormData({ prefeitura: "", saldo: "" });
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao cadastrar Contrato: ${errorMessages}`);
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
              Contrato Prefeitura
            </Typography>
            <form onSubmit={handleSubmit}>
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
                    margin="normal"
                    error={!!errors.prefeitura}
                    helperText={errors.prefeitura}
                  />
                )}
              />

              <TextField
                label="Saldo"
                name="saldo"
                value={formData.saldo}
                onChange={handleInputChange}
                error={!!errors.saldo}
                helperText={errors.saldo}
                margin="normal"
                sx={{ width: "30%" }}
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button type="button" variant="outlined" color="secondary" onClick={() => setFormData({ prefeitura: "", saldo: "" })}>
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
