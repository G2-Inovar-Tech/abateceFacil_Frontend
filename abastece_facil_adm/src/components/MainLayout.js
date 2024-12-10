import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery } from "@mui/material";
import TopBar from "../components/TopBar";
import SideMenu from "../components/SideMenu";

export default function MainLayout({ children }) {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas

  const [open, setOpen] = useState(isMobile? false : true);  // Começa aberto

  const handleDrawerToggle = () => {
    setOpen(!open); // Alterna entre aberto e fechado
  };

  return (
    <Box sx={{ display: "flex", marginLeft: 0 }}>
      {/* CSS Reset */}
      <CssBaseline />

      {/* Barra Superior */}
      <TopBar open={open} handleDrawerToggle={handleDrawerToggle} />

      {/* Menu Lateral */}
      <SideMenu open={open} handleDrawerToggle={handleDrawerToggle} />

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "75px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
