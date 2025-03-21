import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  useTheme,
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
  AppRegistration,
  Link as LinkIcon,
  Description as ContratosIcon,
  AddLocation,
  CorporateFare,
  Dashboard,
  Assessment,
  BarChart,
  BrandingWatermark,
} from "@mui/icons-material";
import iconeAbasteceFacil from "../assets/iconeAplicativoPrefeitura.png";

const drawerWidth = 240;

export default function SideMenu({ open, handleDrawerToggle }) {
  const { userProfile } = useAuth();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [openCadastrarMenu, setOpenCadastrarMenu] = useState(false);
  const [openVincularMenu, setOpenVincularMenu] = useState(false);
  const [openContratosMenu, setOpenContratosMenu] = useState(false);
  const [openRelatoriosMenu, setOpenRelatoriosMenu] = useState(false);

  // Itens do menu para Administrador
  const adminMenuItems = [
    //{ text: "Home", path: "/home", icon: <HomeIcon /> }, // 1ª posição
   /* {
      text: "Gerenciar Prefeituras",
      path: "/gerenciar-prefeituras",
      icon: <PrefeiturasIcon />,
    },// 2ª posição*/
    {
      text: "Gerenciar Saldos e Cartões", 
      path: "/gestao-saldos-cartoes-adm", 
      icon: <Dashboard />, 
    }, // 3ª posição
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
      text: "Cadastrar Veículo",
      path: "/cadastro-veiculo-pre",  
      icon: <DirectionsCar />,
    },
    {
      text: "Cadastrar Motorista",
      path: "/cadastro-motorista-pre",
      icon: <BrandingWatermark />,
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
    { text: "Cadastrar Motorista", path: "/cadastro-motorista-ADM", icon: <BrandingWatermark /> },
    { text: "Cadastrar Veículo", path: "/cadastro-veiculo", icon: <DirectionsCar /> },
    { text: "Cadastrar Endereço", path: "/cadastro-endereco", icon: <AddLocation />},
    { text: "Cadastrar Órgão", path: "/cadastro-orgao", icon: <CorporateFare/>},
  ];

  // Itens de Vincular
  const vincularItems = [
    { text: "Vincular á Prefeitura", path: "/vincular-prefeitura", icon: <LinkIcon /> },
    { text: "Vincular ao Posto", path: "/vincular-posto", icon: <LinkIcon /> },
    { text: "Vincular Posto ao contrato", path: "/vincular-posto-contrato", icon: <LinkIcon /> },
  ];

  // Itens de Contratos
  const contratosItems = [
    { text: "Cadastrar Contrato ", path: "/contrato-prefeitura", icon: <ContratosIcon /> },
  ];

    // Itens de Relatórios
    const relatoriosItems = [
      { text: "Relatório Geral", path: "/relatorio-geral", icon: <Assessment/> },
      { text: "Relatório Detalhado", path: "/relatorio-Detalhado", icon: <Assessment/> },
      { text: "Relatório Posto", path: "/relatorio-Posto", icon: <Assessment/> },
    ];

  const toggleCadastrarMenu = () => setOpenCadastrarMenu(!openCadastrarMenu);
  const toggleVincularMenu = () => setOpenVincularMenu(!openVincularMenu);
  const toggleContratosMenu = () => setOpenContratosMenu(!openContratosMenu);
  const toggleRelatorioMenu = () => setOpenRelatoriosMenu(!openRelatoriosMenu);

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
                {userProfile === "ADM" && text ==="Gerenciar Saldos e Cartões" && (
                  <>
                    <ListItemButton onClick={toggleCadastrarMenu}>
                      <ListItemIcon sx={{ minWidth: "35px" }}>
                        <AppRegistration />
                      </ListItemIcon>
                      <ListItemText
                        primary="Cadastrar"
                        sx={{ fontSize: "0.875rem" }}
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
                                sx={{ fontSize: "0.875rem" }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>

                    {/* Menu "Vincular" */}
                    <ListItemButton onClick={toggleVincularMenu}>
                      <ListItemIcon sx={{ minWidth: "35px" }}>
                        <LinkIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Vincular"
                        sx={{ fontSize: "0.875rem" }}
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
                                sx={{ fontSize: "0.875rem" }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>

                    {/* Menu "Contratos" */}
                    <ListItemButton onClick={toggleContratosMenu}>
                      <ListItemIcon sx={{ minWidth: "35px" }}>
                        <ContratosIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Contratos"
                        sx={{ fontSize: "0.875rem" }}
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
                                sx={{ fontSize: "0.875rem" }}
                              />
                            </ListItemButton>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>


                      {/* Menu "Relatórios" */}
                      <ListItemButton onClick={toggleRelatorioMenu}>
                      <BarChart sx={{ minWidth: "35px" }}>
                        <LinkIcon />
                      </BarChart>
                      <ListItemText
                        primary="Relatórios"
                        sx={{ fontSize: "0.875rem" }}
                      />
                      {openRelatoriosMenu ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openRelatoriosMenu} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {relatoriosItems.map(({ text, path, icon }) => (
                          <ListItem key={text} sx={{ paddingLeft: 4 }}>
                            <ListItemButton component={Link} to={path}>
                              <ListItemIcon sx={{ minWidth: "35px" }}>
                                {icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={text}
                                sx={{ fontSize: "0.875rem" }}
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