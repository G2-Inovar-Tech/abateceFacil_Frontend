import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Container, Typography, Grid, Autocomplete } from "@mui/material";
import MainLayout from "../components/MainLayout";  
import backgroundImage from "../assets/backgroundHome.png";  

export default function VincularPostoContrato() {

  const [formData, setFormData] = useState({
    contrato: "",  
    posto: "",   
  });

  const [errors, setErrors] = useState({});
  const [contratos, setContratos] = useState([]);  
  const [postos, setPostos] = useState([]);  
  const [filteredContratos, setFilteredContratos] = useState([]);  
  const [filteredPostos, setFilteredPostos] = useState([]);  
  const [searchContrato, setSearchContrato] = useState("");  
  const [searchPosto, setSearchPosto] = useState("");  

  // Fetch para contratos
  useEffect(() => {
    const fetchContratos = async () => {
      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/contrato");
        const data = await response.json();
        console.log("Dados dos contratos recebidos:", data);

        if (response.ok) {
          setContratos(data.contratos);
          setFilteredContratos(data.contratos); // Inicializa a lista filtrada com todos os contratos
        } else {
          const errorMessages = data.erros
            ? Object.values(data.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao buscar contratos: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    };

    fetchContratos();
  }, []);

  // Fetch para postos
  useEffect(() => {
    const fetchPostos = async () => {
      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/posto");
        const data = await response.json();
        console.log("Dados dos postos recebidos:", data);

        if (response.ok) {
          setPostos(data.postos);
          setFilteredPostos(data.postos); // Inicializa a lista filtrada com todos os postos
        } else {
          const errorMessages = data.erros
            ? Object.values(data.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao buscar postos: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    };

    fetchPostos();
  }, []);

  // Função para filtrar contratos
  useEffect(() => {
    if (searchContrato) {
      const filtered = contratos.filter((contrato) =>
        contrato.CON_NOME.toLowerCase().includes(searchContrato.toLowerCase())
      );
      setFilteredContratos(filtered);
    } else {
      setFilteredContratos(contratos);
    }
  }, [searchContrato, contratos]);

  // Função para filtrar postos
  useEffect(() => {
    if (searchPosto) {
      const filtered = postos.filter((posto) =>
        posto.PO_NOME.toLowerCase().includes(searchPosto.toLowerCase())
      );
      setFilteredPostos(filtered);
    } else {
      setFilteredPostos(postos);
    }
  }, [searchPosto, postos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.contrato) newErrors.contrato = "Contrato é obrigatório.";
    if (!formData.posto) newErrors.posto = "Posto é obrigatório."; 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    setFormData({
      contrato: "",
      posto: "",
    });
    setSearchContrato(""); 
    setSearchPosto(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const requestData = {
        COP_CON_ID: formData.contrato,
        COP_POS_ID: formData.posto,
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/vincular", {
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
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao vincular posto ao contrato: ${errorMessages}`);
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
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Vincular Posto ao Contrato
            </Typography>
            <form onSubmit={handleSubmit}>

              {/* Campo de busca e seleção de contrato */}
              <Autocomplete
                options={filteredContratos}
                getOptionLabel={(option) => option.CON_NOME}
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
                  />
                )}
              />

              {/* Campo de busca e seleção de posto */}
              <Autocomplete
                options={filteredPostos}
                getOptionLabel={(option) => option.PO_NOME}
                value={postos.find((posto) => posto.PO_ID === formData.posto) || null}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, posto: newValue ? newValue.PO_ID : "" }));
                }}
                onInputChange={(_, newInputValue) => {
                  setSearchPosto(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Posto"
                    fullWidth
                    margin="normal"
                    error={!!errors.posto}
                    helperText={errors.posto}
                  />
                )}
              />

              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel}>
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
