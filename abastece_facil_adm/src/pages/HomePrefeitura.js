import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
  Button,
  Divider,
} from "@mui/material";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem
import MainLayout from "../components/MainLayout.js";

export default function HomePrefeitura() {
  const Prefeituras = [
    {
      index: 1,
      prefeitura: "Prefeitura de São Paulo",
      saldo: 1995.51,
      qntCartoes: 2,
    },
    {
      index: 2,
      prefeitura: "Prefeitura do Rio de Janeiro",
      saldo: 1994.12,
      qntCartoes: 3,
    },
    {
      index: 3,
      prefeitura: "Prefeitura de Jequié",
      saldo: 1993.05,
      qntCartoes: 2,
    },
    {
      index: 4,
      prefeitura: "Prefeitura do Rio de Contas",
      saldo: 1972.54,
      qntCartoes: 2,
    },
    {
      index: 5,
      prefeitura: "Prefeitura de Salvador",
      saldo: 1974.65,
      qntCartoes: 3,
    },
    {
      index: 6,
      prefeitura: "Prefeitura de Ipiaú",
      saldo: 2008.65,
      qntCartoes: 2,
    },
    {
      index: 7,
      prefeitura: "Prefeitura de Jitauna",
      saldo: 1957.78,
      qntCartoes: 1,
    },
    {
      index: 8,
      prefeitura: "Prefeitura de Itabuna",
      saldo: 1993.12,
      qntCartoes: 4,
    },
    {
      index: 9,
      prefeitura: "Prefeitura de Jaguaguara",
      saldo: 1996.32,
      qntCartoes: 3,
    },
  ];
  const Prefeitura = [
    "Prefeitura de São Paulo",
    "Prefeitura do Rio de Janeiro",
    "Prefeitura de Jequié",
    "Prefeitura do Rio de Contas",
    "Prefeitura de Salvador",
    "Prefeitura de Ipiaú",
    "Prefeitura de Jitauna",
    "Prefeitura de Itabuna",
    "Prefeitura de Jaguaguara",
  ];

  const location = useLocation();
  const navigate = useNavigate();
  
  const handleAccess = () => {
    const redirectTo = location.state?.from?.pathname || "/home-prefeitura";
    navigate(redirectTo); // Navega para a página Home
  };

  return (
    <MainLayout titlePage={"Abastece Fácil - Prefeitura de Abaira"}>
      <Box
        sx={{
          flexGrow: 1, // Faz com que ocupe o restante do espaço vertical.
          backgroundImage: `url(${backgroundImage})`,
          //backgroundSize: "cover",
          //backgroundPosition: "center",
          //backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
          backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          //display: "flex",
          //flexDirection: "column",
        }}
      >
        {Prefeituras.length > 0 ? (
          <Box>
            <Typography variant="h4" gutterBottom>
              Visão Geral
            </Typography>
            <Box 
            sx={{
              backgroundColor: "#FFFFFF", // Cor branca com transparência.
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}>
              <CardContent>
                {/* <Typography variant="h6" component="div">
                {prefeitura}
              </Typography> */}
                <Typography variant="h6" component="div">
                  Informações de contrato:
                </Typography>
                <Typography
                  variant="body1"
                  //align="right"
                  color="text.secondary"
                >
                  Saldo contrato R$ 500.000,00
                </Typography>
                <Divider sx={{marginY: "20px"}} />
                <Typography variant="h6" component="div">
                  Informações dos cartões:
                </Typography>
                <Typography
                  variant="body2"
                  align="right"
                  color="text.secondary"
                >
                  Saldo atual R$ 100.000,00
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantidade de cartões: 5
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/gestao-saldos-cartoes")}
                  >
                    Gerenciar cartões e saldos
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "70vh",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ mb: 4 }} color="gray">
              Nenhuma informação encontrada!
            </Typography>
          </Box>
        )}
      </Box>
    </MainLayout>
  );
}
