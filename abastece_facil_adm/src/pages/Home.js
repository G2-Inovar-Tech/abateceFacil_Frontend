import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid2,
} from "@mui/material";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem
import MainLayout from "../components/MainLayout.js";

export default function Home() {
  return (
    <MainLayout>
      <Box
        sx={{
          flexGrow: 1, // Faz com que ocupe o restante do espaço vertical.
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
          backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Overview
        </Typography>
        <Grid2 container spacing={3} sx={{ width: "100%" }}>
          {/* Cards */}
          {[
            "Prefeitura de Mandaratiba",
            "Prefeitura de Barreiras",
            "Prefeitura de Juazeiro",
          ].map((title, index) => (
            <Grid2
              item
              xs={12}
              sm={6}
              md={4}
              key={index}
              sx={{ width: "100%" }}
            >
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Informações relevantes sobre {title.toLowerCase()}.
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </MainLayout>
  );
}
