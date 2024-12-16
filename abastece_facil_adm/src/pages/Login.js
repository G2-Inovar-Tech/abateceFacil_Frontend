import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { styled } from "@mui/system";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false); // Estado para lembrar-me
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  
  const navigate = useNavigate();
  
  const handleAccess = () => {
    const redirectTo = location.state?.from?.pathname || "/home";
    navigate(redirectTo); // Navega para a página Home
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Usuário é obrigatório.";
    if (!formData.password.trim()) newErrors.password = "Senha é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log("Login enviado:", formData);
      //alert('Bem-vindo ao sistema!');
      login(rememberMe);
      handleAccess();
      // Lógica de autenticação a ser implementada
    }
  };

  // Redireciona para Home se já autenticado
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Estilização customizada para a imagem do lado esquerdo
  const LeftImage = styled("div")(({ theme }) => ({
    flex: 1,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("sm")]: {
      flex: 0,
      height: "40vh",
    },
  }));

  return (
    <Box
      display="flex"
      height="100vh"
      sx={{
        backgroundImage: isSmallScreen ? `url(${backgroundImage})` : "none",
        //backgroundSize: "cover", // Estica a imagem de background para ocupa todo espaço.
        //backgroundPosition: "center", // Centraliza a imagem do background.
        //backgroundRepeat: "no-repeat", // Deixa apenas uma imagem, sem repeti-la.
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
        backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
      }}
    >
      {!isSmallScreen && <LeftImage />}
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          padding: 4,
        }}
      >
        <Box>
          <Box
            sx={{
              marginBottom: "40px",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              color={isSmallScreen ? "#02153D" : "#808A9E"}
              sx={{
                fontWeight: "700",
                textTransform: "uppercase",
                //textShadow: "1px 1px 2px white, 0 0 0.2em blue, 0 0 0.05em #808A9E", // Adiciona sombreado ao texto.
              }}
            >
              Gestão Abastece Fácil
            </Typography>
          </Box>
          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              //backgroundColor: isSmallScreen ? "#FFFFFF00" : "", // Deixar fundo transparente.
            }}
          >
            <Typography variant="h5" gutterBottom align="center">
              Login
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                fullWidth
                label="Usuário"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                error={!!errors.username}
                helperText={errors.username}
                margin="normal"
              />
              <TextField
                fullWidth
                type="password"
                label="Senha"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                error={!!errors.password}
                helperText={errors.password}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                  />
                }
                label="Mantenha-me conectado"
              />
              <Box mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    backgroundColor: "#808A9E",
                  }}
                >
                  Acessar
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
