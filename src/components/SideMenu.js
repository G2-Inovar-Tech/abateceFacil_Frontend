import React, { useState } from "react";
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
  Collapse,
} from "@mui/material";
import { useAuth } from "../context/AuthContext"; 
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Apartment as PrefeiturasIcon,
  AddHomeWork as AddPrefeiturasIcon2,
  BarChart as RelatoriosIcon,
  PersonAdd as CadastrarUsuariosIcon,
  Settings as ConfiguracoesIcon,
  LocalGasStation as BombaCombustivelIcone,
  History as HistoryIcon,
  AddCard,
  ExpandMore,
  ExpandLess,
  DirectionsCar,
  AppRegistration, // Importando o ícone correto
  Link as LinkIcon, // Ícone para Vincular
  Description as ContratosIcon, // Ícone para Contratos
} from "@mui/icons-material";
import iconeAbasteceFacil from "../assets/iconeAplicativoPrefeitura.png";

const drawerWidth = 240;

export default function SideMenu({ open, handleDrawerToggle }) {
  const { userProfile } = useAuth(); // Obtém o perfil do usuário autenticado
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas
  const [openCadastrarMenu, setOpenCadastrarMenu] = useState(false); // Estado para controlar o menu Cadastrar
  const [openVincularMenu, setOpenVincularMenu] = useState(false); // Estado para controlar o menu Vincular
  const [openContratosMenu, setOpenContratosMenu] = useState(false); // Estado para controlar o menu Contratos

  // Itens do menu para Administrador
  const adminMenuItems = [
    { text: "Home", path: "/home", icon: <HomeIcon /> },
    {
      text: "Gerenciar Prefeituras",
      path: "/gerenciar-prefeituras",
      icon: <PrefeiturasIcon />,
    },
    { text: "Relatórios", path: "/relatorios", icon: <RelatoriosIcon /> },
    {
      text: "Configurações",
      path: "/configuracoes",
      icon: <ConfiguracoesIcon />,
    },
  ];

  // Itens do menu para Prefeitura
  const prefeituraMenuItems = [
    { text: "Visão Geral", path: "/home-prefeitura", icon: <HomeIcon /> },
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

  // Itens de Cadastro
  const cadastroItems = [
    { text: "Cadastrar Prefeitura", path: "/cadastro-prefeitura", icon: <AddPrefeiturasIcon2 /> },
    { text: "Cadastrar Posto", path: "/cadastro-posto", icon: <BombaCombustivelIcone /> },
    { text: "Cadastrar Cartão", path: "/cadastro-cartao", icon: <AddCard /> },
    { text: "Cadastar Usuário", path: "/cadastro-usuario", icon: <CadastrarUsuariosIcon /> },
    { text: "Cadastrar Veículo", path: "/cadastro-veiculo", icon: <DirectionsCar /> },
  ];

  // Itens de Vincular
  const vincularItems = [
    { text: "Vincular á Prefeitura", path: "/vincular-prefeitura", icon: <LinkIcon /> },
    { text: "Vincular ao Posto", path: "/vincular-posto", icon: <LinkIcon /> },
    { text: "Vincular Posto ao contrato", path: "/vincular-posto-contrato", icon: <LinkIcon /> },
  ];

  // Itens de Contratos
  const contratosItems = [
    { text: "Contrato Prefeitura", path: "/contrato-prefeitura", icon: <ContratosIcon /> },
 
  ];

  const toggleCadastrarMenu = () => setOpenCadastrarMenu(!openCadastrarMenu); // Função para alternar o menu "Cadastrar"
  const toggleVincularMenu = () => setOpenVincularMenu(!openVincularMenu); // Função para alternar o menu "Vincular"
  const toggleContratosMenu = () => setOpenContratosMenu(!openContratosMenu); // Função para alternar o menu "Contratos"

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
              <React.Fragment key={text}>
                <ListItem sx={{ padding: "0px" }}>
                  <ListItemButton
                    component={Link}
                    to={path}
                    sx={{ padding: "10px 15px", fontSize: "0.875rem" }} 
                  >
                    <ListItemIcon sx={{ minWidth: "35px" }}>
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>

                {/* Renderiza o menu "Cadastrar" logo após "Gerenciar Prefeituras" */}
                {userProfile === "ADM" && text === "Gerenciar Prefeituras" && (
                  <>
                    <ListItemButton onClick={toggleCadastrarMenu}>
                      <ListItemIcon sx={{ minWidth: "35px" }}>
                        <AppRegistration /> {/* Ícone para Cadastrar */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Cadastrar"
                        sx={{ fontSize: "0.875rem" }} // Diminuir o tamanho da fonte
                      />
                      {openCadastrarMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openCadastrarMenu} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {cadastroItems.map(({ text, path, icon }) => (
                          <ListItem key={text} sx={{ paddingLeft: 4 }}>
                            <ListItemButton component={Link} to={path}>
                              <ListItemIcon sx={{ minWidth: "35px" }}>
                                {icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={text}
                                sx={{ fontSize: "0.875rem" }} // Diminuir o tamanho da fonte
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>

                    {/* Menu "Vincular" */}
                    <ListItemButton onClick={toggleVincularMenu}>
                      <ListItemIcon sx={{ minWidth: "35px" }}>
                        <LinkIcon /> {/* Ícone para Vincular */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Vincular"
                        sx={{ fontSize: "0.875rem" }} // Diminuir o tamanho da fonte
                      />
                      {openVincularMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openVincularMenu} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {vincularItems.map(({ text, path, icon }) => (
                          <ListItem key={text} sx={{ paddingLeft: 4 }}>
                            <ListItemButton component={Link} to={path}>
                              <ListItemIcon sx={{ minWidth: "35px" }}>
                                {icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={text}
                                sx={{ fontSize: "0.875rem" }} // Diminuir o tamanho da fonte
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>

                    {/* Menu "Contratos" */}
                    <ListItemButton onClick={toggleContratosMenu}>
                      <ListItemIcon sx={{ minWidth: "35px" }}>
                        <ContratosIcon /> {/* Ícone para Contratos */}
                      </ListItemIcon>
                      <ListItemText
                        primary="Contratos"
                        sx={{ fontSize: "0.875rem" }} // Diminuir o tamanho da fonte
                      />
                      {openContratosMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openContratosMenu} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {contratosItems.map(({ text, path, icon }) => (
                          <ListItem key={text} sx={{ paddingLeft: 4 }}>
                            <ListItemButton component={Link} to={path}>
                              <ListItemIcon sx={{ minWidth: "35px" }}>
                                {icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={text}
                                sx={{ fontSize: "0.875rem" }} // Diminuir o tamanho da fonte
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                )}
              </React.Fragment>
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