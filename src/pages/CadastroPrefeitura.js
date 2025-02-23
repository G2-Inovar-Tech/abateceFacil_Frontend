import React, { useState } from "react";
import InputMask from "react-input-mask";

import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Container,
  Box,
  Typography,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem

export default function CadastroPrefeitura() {
  const [formData, setFormData] = useState({
    nomefantasia: "",
    razaosocial: "",
    email: "",
    phone: "",
    saldo: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "saldo") {
      newValue = value.replace(",", ".");
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.nomefantasia.trim()) newErrors.nomefantasia = "Nome Fantasia é obrigatório";
    if (!formData.razaosocial.trim()) newErrors.razaosocial = "Razão social é obrigatório.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "E-mail inválido.";

    const cleanedPhone = formData.phone.replace(/\D/g, ''); 
    if (!cleanedPhone || cleanedPhone.length < 10 || cleanedPhone.length > 15) {
      newErrors.phone = "Telefone inválido (apenas números, 10-15 dígitos).";
    }
    if (!formData.saldo.trim() || !/^\d+([.,]\d{1,2})?$/.test(formData.saldo)) newErrors.saldo = "Saldo inválido (apenas números, com até 2 casas decimais).";



    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      const requestData = {
        PRE_NOME: formData.nomefantasia,
        PRE_RAZAO_SOCIAL: formData.razaosocial,
        PRE_TELEFONE: formData.phone,
        PRE_EMAIL: formData.email,
        PRE_SALDO_ATUAL: formData.saldo,
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/prefeitura", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Prefeitura cadastrado com sucesso!");
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao cadastrar Prefeitura: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      nomefantasia: "",
      razaosocial: "",
      email: "",
      phone: "",
      saldo: "",
    });
    setErrors({});
  };

  return (
    <MainLayout>
      <Box
        sx={{

          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover", // Estica a imagem de background para ocupa todo espaço.
          backgroundPosition: "center", // Centraliza a imagem do background.
          backgroundRepeat: "no-repeat", // Deixa apenas uma imagem, sem repeti-la.
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
          backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              //backgroundColor: "#FFFFFF00", // Deixar fundo transparente.
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Cadastro de Prefeitura
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome Fantasia"
                name="nomefantasia"
                value={formData.nomefantasia}
                onChange={handleInputChange}
                error={!!errors.nomefantasia}
                helperText={errors.nomefantasia}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Razão Social"
                name="razaosocial"
                value={formData.razaosocial}
                onChange={handleInputChange}
                error={!!errors.razaosocial}
                helperText={errors.razaosocial}
                margin="normal"
              />

              {/* Box para os campos de E-mail e Telefone */}
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <TextField
                  fullWidth
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  margin="normal"
                />


                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.phone}
                  onChange={handleInputChange}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      label="Telefone"
                      name="phone"
                      error={!!errors.phone}
                      helperText={errors.phone}
                      margin="normal"
                    />
                  )}
                </InputMask>
              </Box>

              {/* CAMPO DO SALDO*/}
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-start" }}>
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
              </Box>


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

    // <MainLayout>
    //   <Box>
    //     <Typography>Hello Word!</Typography>
    //     <Typography>Cadastro de Prefeitura</Typography>
    //   </Box>
    // </MainLayout>
  );
}