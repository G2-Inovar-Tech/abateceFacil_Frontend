import React from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Grid2,
  Avatar,
  Stack,
} from "@mui/material";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem
import iconeAbasteceFacil from "../assets/iconeAplicativoPrefeitura.png";
import imagemPerfil from "../assets/imagemPerfil.jpg";

const drawerWidth = 240;

export default function Home() {
  return (
    <Box sx={{ display: "flex" }}>
      {/* CSS Reset */}
      <CssBaseline />

      {/* Barra Superior */}
      <AppBar
        position="fixed"
        sx={{
          alignContent: "center",
          flexwrap: "wrap",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar
          sx={{
            background: "#02153D",
            alignContent: "center",
            flexwrap: "wrap",
            width: "100%",
            display: "flex",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ width: "100%" }}
          >
            Abastece Fácil
          </Typography>
          <Stack direction="row" spacing={2}>
            <Avatar alt="Remy Sharp" src={imagemPerfil} />
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Menu Lateral */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ overflow: "auto", height: "100%", marginTop: "75px" }}>
          <List>
            {[
              "Overview",
              "Gerenciar Prefeituras",
              "Relatórios",
              "Configurações",
            ].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            alignItems: "end",
            height: "100%",
          }}
        >
          <img src={iconeAbasteceFacil} alt="icone" width="80px"></img>
        </Box>
        <Typography
          variant="caption"
          noWrap
          component="div"
          textAlign="center"
          sx={{ width: "100%", paddingBottom: "10px" }}
        >
          Desenvolvido por G2 - V1.0
        </Typography>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "75px",
        }}
      >
        {/* <Toolbar /> */}
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
      </Box>
    </Box>
  );
}