import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import iconeAbasteceFacil from "../assets/iconeAplicativoPrefeitura.png";
import logoEmpresaG2 from "../assets/logoEmpresaG2.png";

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box sx={{ margin: "60px" }}>
        <img src={logoEmpresaG2} alt="icone" width="80px"></img>
      </Box>
      <Typography variant="h1" sx={{ fontSize: 64, fontWeight: "bold" }}>
        404
      </Typography>
      <Typography variant="h6" sx={{ mb: 4 }}>
        Página Não Encontrada
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/home">
        Voltar para a Página Inicial
      </Button>
      <Box sx={{ margin: "60px" }}>
        <img src={iconeAbasteceFacil} alt="icone" width="80px"></img>
      </Box>
    </Box>
  );
}
