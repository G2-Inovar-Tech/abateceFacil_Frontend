import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import MainLayout from "../components/MainLayout.js";

export default function HistoricoPrefeitura() {
  const [title, setTitle] = useState("Abastece Fácil - Prefeitura de ...");
  const [loading, setLoading] = useState(true);

  setTimeout(() => { // Simula um atraso de 2 segundos para carregar os dados
      setTitle("Abastece Fácil - Prefeitura de " + "Abaira");
      setLoading(false);
  }, 1000);
  return (
    <MainLayout titlePage={title} loading={loading}>
      <Box>
        {/* <Typography>Hello Word!</Typography> */}
        <Typography variant="h3">Histórico</Typography>
        <Typography variant="body1">Nenhum dadao encontrado!</Typography>
      </Box>
    </MainLayout>
  );
}
