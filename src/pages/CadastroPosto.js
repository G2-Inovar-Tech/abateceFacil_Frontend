import React, { useState } from "react";
import InputMask from "react-input-mask";

import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png"; // Imagem de fundo

export default function CadastroPosto() {
  const [formData, setFormData] = useState({
    razaosocial: "",
    cnpj: "",
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
    if (!formData.razaosocial.trim()) newErrors.razaosocial = "Razão social é obrigatória.";
    if (!formData.cnpj.trim() || formData.cnpj.length !== 18) newErrors.cnpj = "CNPJ inválido.";
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
        POSTO_RAZAO_SOCIAL: formData.razaosocial,
        POSTO_CNPJ: formData.cnpj,
        POSTO_TELEFONE: formData.phone,
        POSTO_SALDO_ATUAL: formData.saldo,
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/posto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Posto cadastrado com sucesso!");
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao cadastrar Posto: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      razaosocial: "",
      cnpj: "",
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
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Cadastro de Posto
            </Typography>
            <form onSubmit={handleSubmit}>
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

              {/* Box para os campos de CNPJ e Telefone lado a lado */}
              <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <InputMask
                  mask="99.999.999/9999-99"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="CNPJ"
                      name="cnpj"
                      error={!!errors.cnpj}
                      helperText={errors.cnpj}
                      margin="normal"
                    />
                  )}
                </InputMask>

                <InputMask
                  mask="(99) 99999-9999"
                  value={formData.phone}
                  onChange={handleInputChange}
                >
                  {(inputProps) => (
                    <TextField
                      {...inputProps}
                      fullWidth
                      label="Telefone"
                      name="phone"
                      error={!!errors.phone}
                      helperText={errors.phone}
                      margin="normal"
                    />
                  )}
                </InputMask>
              </Box>

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
