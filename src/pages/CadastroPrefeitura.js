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

export default function CadastroPrefeitura() {
  const [formData, setFormData] = useState({
    razaosocial: "",
    cnpj: "",
    contrato: "",
    cep: "",
    uf: "",
    cidade: "",
    logradouro: "",
    numero: "",
    status: "",
    usuario: "",
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
    if (!formData.razaosocial.trim())
      newErrors.razaosocial = "Razão social é obrigatório.";
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório.";
    if (!formData.contrato.trim())
      newErrors.contrato = "Número do contrato é obrigatório.";
    if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório.";
    if (!formData.uf.trim()) newErrors.uf = "UF é obrigatório.";
    if (!formData.cidade.trim()) newErrors.cidade = "Cidade é obrigatório.";
    if (!formData.logradouro.trim())
      newErrors.logradouro = "Logradouro é obrigatório.";
    if (!formData.numero.trim()) newErrors.numero = "Número é obrigatório.";
    if (!formData.status) newErrors.status = "Status é obrigatório.";
    if (!formData.usuario.trim()) newErrors.usuario = "Usuário é obrigatório.";
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
      alert("Prefeitura cadastrado com sucesso!");
    }
  };

  const handleCancel = () => {
    setFormData({
      razaosocial: "",
      cnpj: "",
      contrato: "",
      cep: "",
      uf: "",
      cidade: "",
      logradouro: "",
      numero: "",
      status: "",
      usuario: "",
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
                label="Razão social"
                name="razaosocial"
                value={formData.razaosocial}
                onChange={handleInputChange}
                error={!!errors.razaosocial}
                helperText={errors.razaosocial}
                margin="normal"
              />
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleInputChange}
                  error={!!errors.cnpj}
                  helperText={errors.cnpj}
                  margin="normal"
                  sx={{ minWidth: "60%", marginRight: "20px" }}
                />

                <TextField
                  fullWidth
                  label="Contrato"
                  name="contrato"
                  value={formData.contrato}
                  onChange={handleInputChange}
                  error={!!errors.contrato}
                  helperText={errors.contrato}
                  margin="normal"
                  maxWidth="30%"
                />
              </Box>
              {/* ToDo: Criar um component Endereço */}
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  boxShadow: 3,
                  padding: "10px",
                  margin: "16px 0 8px 0",
                }}
              >
                <Typography
                  variant="subtitle1"
                  component="h1"
                  gutterBottom
                  align="justify"
                >
                  Dados de Endereço
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    error={!!errors.cidade}
                    helperText={errors.cidade}
                    margin="normal"
                    sx={{ minWidth: "60%", marginRight: "20px" }}
                  />

                  <TextField
                    fullWidth
                    label="UF"
                    name="uf"
                    value={formData.uf}
                    onChange={handleInputChange}
                    error={!!errors.uf}
                    helperText={errors.uf}
                    margin="normal"
                    maxWidth="30%"
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Logradouro"
                  name="logradouro"
                  value={formData.logradouro}
                  onChange={handleInputChange}
                  error={!!errors.logradouro}
                  helperText={errors.logradouro}
                  margin="normal"
                />

                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <TextField
                    fullWidth
                    label="CEP"
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    error={!!errors.cep}
                    helperText={errors.cep}
                    margin="normal"
                    maxWidth="40%"
                    sx={{ marginRight: "20px" }}
                  />

                  <TextField
                    fullWidth
                    label="Número"
                    name="numero"
                    value={formData.numero}
                    onChange={handleInputChange}
                    error={!!errors.numero}
                    helperText={errors.numero}
                    margin="normal"
                  />
                </Box>
              </Box>

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

              <TextField
                fullWidth
                label="Usuário"
                name="usurario"
                value={formData.usuario}
                onChange={handleInputChange}
                error={!!errors.usuario}
                helperText={errors.usuario}
                margin="normal"
              />

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
    //     <Typography>Cadastro de Prefeitura</Typography>
    //   </Box>
    // </MainLayout>
  );
}
