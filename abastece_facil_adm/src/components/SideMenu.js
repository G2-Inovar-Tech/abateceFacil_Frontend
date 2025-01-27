import React from "react";
import { Link } from "react-router-dom"; // Importa Link para navegação
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "../context/AuthContext"; 
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Apartment as PrefeiturasIcon,
  // Add as AddIcon,
  // HomeWork as PrefeiturasIcon2,
  AddHomeWork as AddPrefeiturasIcon2,
  BarChart as RelatoriosIcon,
  PersonAdd as CadastrarUsuariosIcon,
  Settings as ConfiguracoesIcon,
  LocalGasStation as BombaCombustivelIcone,
  History as HistoryIcon,
} from "@mui/icons-material";
//import HistoryIcon from '@mui/icons-material/History';
import iconeAbasteceFacil from "../assets/iconeAplicativoPrefeitura.png";

const drawerWidth = 240;

export default function SideMenu({ open, handleDrawerToggle }) {
  const { userProfile } = useAuth(); // Obtém o perfil do usuário autenticado
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas

  const adminMenuItems = [
    // "Overview",
    // "Gerenciar Prefeituras",
    // "Cadastro de Usuários",
    // "Relatórios",
    // "Configurações",
    { text: "Overview", path: "/home", icon: <HomeIcon /> },
    {
      text: "Gerenciar Prefeituras",
      path: "/gerenciar-prefeituras",
      icon: <PrefeiturasIcon />,
    },
    { text: "Relatórios", path: "/relatorios", icon: <RelatoriosIcon /> },
    {
      text: "Cadastrar Usuários",
      path: "/cadastro-usuario",
      icon: <CadastrarUsuariosIcon />,
    },
    {
      text: "Cadastrar Prefeitura",
      path: "/cadastro-prefeitura",
      icon: <AddPrefeiturasIcon2 />,
    },
    {
      text: "Cadastrar Posto",
      path: "/cadastro-posto",
      icon: <BombaCombustivelIcone />,
    },
    {
      text: "Configurações",
      path: "/configuracoes",
      icon: <ConfiguracoesIcon />,
    },
  ];

  // Itens do menu para Prefeitura
  const prefeituraMenuItems = [
    { text: "Overview", path: "/home-prefeitura", icon: <HomeIcon /> },
    {
      text: "Gerenciar Saldos e Cartões",
      path: "/gestao-saldos-cartoes",
      icon: <PrefeiturasIcon />,
    },
    {
      text: "Historico",
      path: "/historico-prefeitura",
      icon: <HistoryIcon />,
    },
  ];

  // Define os itens do menu com base no perfil
  const menuItems = userProfile === "ADM" ? adminMenuItems : prefeituraMenuItems;

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        sx={{
          width: `calc(${open ? drawerWidth : 0}px)`,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "end",
            minHeight: "64px",
            background: "#02153D",
            alignContent: "center",
            boxShadow: 3,
            paddingRight: "24px",
          }}
        >
          <IconButton onClick={handleDrawerToggle}>
            <MenuIcon style={{ color: "white" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            overflow: "auto",
            height: "100%",
          }}
        >
          <List>
            {menuItems.map(({ text, path, icon }, index) => (
              <ListItem key={text} sx={{ padding: "0px" }}>
                <ListItemButton
                  component={Link}
                  to={path}
                  sx={{ padding: "10px 15px" }}
                >
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            alignItems: "end",
          }}
        >
          <img src={iconeAbasteceFacil} alt="icone" width="80px"></img>
        </Box>
        <Typography
          variant="caption" sx={{ textAlign: "center", width: "100%", pb: 1 }}
        >
          Desenvolvido por G2 - V1.0
        </Typography>
      </Drawer>
    </>
  );
}
