import React, { useState } from "react";

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
import backgroundImage from "../assets/backgroundHome.png"; 

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    phone: "",
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
    if (!formData.type) newErrors.type = "Tipo é obrigatório.";
    if (!formData.phone.trim() || !/^\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Telefone inválido (apenas números, 10-15 dígitos).";
    if (!formData.login.trim()) newErrors.login = "Login é obrigatório.";
    if (!formData.password) newErrors.password = "Senha é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const requestData = {
        nome: formData.name, 
        tipo: formData.type,
        telefone: formData.phone,
        login: formData.login,
        senha: formData.password,
        status: "ATIVO",
        USU_DATA_VINCULACAO: new Date().toISOString(),
      };

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Usuário cadastrado com sucesso!");
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao cadastrar usuário: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "",
      phone: "",
      login: "",
      password: "",
    });
    setErrors({});
  };

  return (
    <MainLayout>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backgroundBlendMode: "overlay",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Cadastro de Usuário
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
              />

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                  row
                  name="type"
                  value={formData.type}
                  onChange={(e) => handleInputChange({ target: { name: "type", value: e.target.value } })}
                >
                  <FormControlLabel value="ADM" control={<Radio />} label="ADM" />
                  <FormControlLabel value="PREFEITURA" control={<Radio />} label="PREFEITURA" />
                  <FormControlLabel value="POSTO" control={<Radio />} label="POSTO" />

                </RadioGroup>
                {errors.type && (
                  <Typography color="error" variant="body2">
                    {errors.type}
                  </Typography>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                error={!!errors.phone}
                helperText={errors.phone}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Login"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                error={!!errors.login}
                helperText={errors.login}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Senha"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
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
