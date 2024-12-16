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
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem

export default function CadastroUsuario() {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "",
    login: "",
    email: "",
    phone: "",
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
    if (!formData.status) newErrors.status = "Status é obrigatório.";
    if (!formData.login.trim()) newErrors.login = "Login é obrigatório.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "E-mail inválido.";
    if (!formData.phone.trim() || !/^\d{10,15}$/.test(formData.phone))
      newErrors.phone = "Telefone inválido (apenas números, 10-15 dígitos).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Formulário enviado com sucesso!", formData);
      alert("Usuário cadastrado com sucesso!");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "",
      status: "",
      login: "",
      email: "",
      phone: "",
    });
    setErrors({});
  };

  return (
    <MainLayout>
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          //backgroundSize: "cover", // Estica a imagem de background para ocupa todo espaço.
          //backgroundPosition: "center", // Centraliza a imagem do background.
          //backgroundRepeat: "no-repeat", // Deixa apenas uma imagem, sem repeti-la.
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
          backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
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
              //backgroundColor: "#FFFFFF00", // Deixar fundo transparente.
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

              <FormControl component="fieldset" margin="normal" sx={{ marginRight: "100px" }}>
                <FormLabel component="legend">Tipo</FormLabel>
                <RadioGroup
                  row
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="Admin"
                    control={<Radio />}
                    label="Admin"
                  />
                  <FormControlLabel
                    value="User"
                    control={<Radio />}
                    label="User"
                  />
                </RadioGroup>
                {errors.type && (
                  <Typography color="error" variant="body2">
                    {errors.type}
                  </Typography>
                )}
              </FormControl>

              <FormControl component="fieldset" margin="normal">
                <FormLabel component="legend">Status</FormLabel>
                <RadioGroup
                  row
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="Ativo"
                    control={<Radio />}
                    label="Ativo"
                  />
                  <FormControlLabel
                    value="Inativo"
                    control={<Radio />}
                    label="Inativo"
                  />
                </RadioGroup>
                {errors.status && (
                  <Typography color="error" variant="body2">
                    {errors.status}
                  </Typography>
                )}
              </FormControl>

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
                label="E-mail"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />

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

              <Box
                sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Cadastrar
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  onClick={handleCancel}
                >
                  Cancelar
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
    //     <Typography>Cadastro de Usuário</Typography>
    //   </Box>
    // </MainLayout>
  );
}
