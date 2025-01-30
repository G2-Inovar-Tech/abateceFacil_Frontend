import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function Loader({ message = "Carregando..." }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <CircularProgress color="primary" size={50} />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
}
