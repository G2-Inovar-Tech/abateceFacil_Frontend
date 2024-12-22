import React, { useState } from "react";
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  IconButton,
  InputBase,
  Autocomplete,
  Button,
  Container,
  Box,
  Typography,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem
import { styled } from "@mui/material/styles";

export default function GerenciarPrefeituras() {
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

  const [title, setTitle] = useState("");

  const buscarPrefeitura = () => {
    // ToDo: Fazer as requisiçoes para buscar as informações da prefeitura.
    if (prefeitura) setTitle("Gerenciando: " + prefeitura?.label);
    else setTitle("");

    console.log("Você pesquisou por:", prefeitura);
  };

  const top100Films = [
    { label: "The Shawshank Redemption", year: 1994 },
    { label: "The Godfather", year: 1972 },
    { label: "The Godfather: Part II", year: 1974 },
    { label: "The Dark Knight", year: 2008 },
    { label: "12 Angry Men", year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: "Pulp Fiction", year: 1994 },
  ];

  const [prefeitura, setPrefeitura] = useState("");

  const options = [
    { label: "Prefeitura de São Paulo" },
    { label: "Prefeitura do Rio de Janeiro" },
    // ... more options
  ];

  return (
    <MainLayout titlePage={"Gerenciar Prefeituras"}>
      <Paper
        component="form"
        elevation={18}
        sx={{
          //p: "2px 4px",
          paddingRight: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          //width: 400,
          marginBottom: "20px",
          borderRadius: "15px",
        }}
      >
        <StyledAutocomplete
          disablePortal
          options={top100Films}
          value={prefeitura}
          onChange={(event, newValue) => {
            setPrefeitura(newValue);
          }}
          renderInput={(params) => (
            <StyledTextField
              {...params}
              label="Buscar Prefeitura"
              variant="filled"
            />
          )}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={buscarPrefeitura}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
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
        <Typography variant="h6" component="h1" gutterBottom align="left">
          {title}
        </Typography>
        {title !== "" ? (
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
              <Box
                sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}
              >
                <Button type="submit" variant="contained" color="primary">
                  Salvar
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
            </Box>
          </Container>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 4 }} color="gray">
              Busque uma prefeitura!
            </Typography>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiAutocomplete-inputRoot": {
    borderRadius: "15px",
    borderColor: "black",
    borderWidth: "2px",
    backgroundColor: "white",
  },
  "& .MuiAutocomplete-label": {
    display: "none",
  },
  "& .css-113d811-MuiFormLabel-root-MuiInputLabel-root": {
    display: "none",
  },
  flexGrow: 1,
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiFilledInput-root": {
    "&::before, &::after": {
      borderBottom: "none",
    },
    "&:hover:not(.Mui-disabled, .Mui-error):before": {
      borderBottom: "none",
    },
    "&.Mui-focused:after": {
      borderBottom: "none",
    },
  },
}));
