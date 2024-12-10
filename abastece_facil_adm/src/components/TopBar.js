import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import imagemPerfil from "../assets/imagemPerfil.jpg";

export default function TopBar({ open, handleDrawerToggle }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${open ? 240 : 0}px)`, // drawerWidth is fixed at 240
        height: "64px",
        alignContent: "center",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexWrap: "initial",
          width: "100%",
          minHeight: "65px",
          alignContent: "center",
          background: "#02153D",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={handleDrawerToggle}
          disabled={open}
          style={{ opacity: !open ? 1 : 0 }}
        >
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ width: "100%" }}>
          Abastece Fácil
        </Typography>
        <Stack direction="row" spacing={2}>
          <Avatar alt="Remy Sharp" src={imagemPerfil} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
