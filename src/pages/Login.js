import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
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
import SmallLoader from "../components/SmallLoader.js";
import backgroundImage from "../assets/backgroundHome.png"; // Importa a imagem

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const [rememberMe, setRememberMe] = useState(false); // Estado para lembrar-me
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  
  const navigate = useNavigate();
  
  const handleAccess = (profile) => {
    if(profile === "ADM") {
      const redirectTo = location.state?.from?.pathname || "/home";
      navigate(redirectTo); // Navega para a página Home
    }
    else if(profile === "PREFEITURA") {
      const redirectTo = location.state?.from?.pathname || "/home-prefeitura";
      navigate(redirectTo); // Navega para a página HomePrefeitura
    }
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
    setLoading(false);
    return Object.keys(newErrors).length === 0;
  };

  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);

    if (!formData.username || !formData.password) {
      validate();
      //alert("Atenção!\n\nPor favor, preencha todos os campos.");
      console.log("Atenção!\n\nPor favor, preencha todos os campos.");
      return;
    }
    
    try {
      console.log("Tentando conexão com o servidor...");
      const response = await axios.post(
        "https://g2inovartech.com.br/api/login",
        {
          login: formData.username,
          password: formData.password,
          tipo: "web",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
        }
      );
      console.log("Depois de conexão com o servidor...");
      //console.log(response.data);

      const { token } = response.data;
      const { user } = response.data;

      let idUsuario = `${user.USU_ID}`;
      let idPrefeitura = user.PRE_ID ? `${user.PRE_ID}` : "";
      let idAdm = user.ADM_ID ? `${user.ADM_ID}` : "";
      let tipoUser = user.USU_TIPO;
      let nomePrefeitura = user.PRE_NOME ? user.PRE_NOME : "";
      
      login(rememberMe, tipoUser, {token, idUsuario, idPrefeitura, idAdm, nomePrefeitura});
      handleAccess(tipoUser);
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message || "Erro ao realizar login. Tente novamente.";
      alert("Erro:\n" + errorMessage);
      console.log("Erro: " + errorMessage);
    } finally {
      setLoading(false);
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
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    backgroundColor: "#808A9E",
                  }}
                  disabled={loading}
                  onClick={handleLogin}
                >
                  {loading ? <SmallLoader size={20} /> : "Acessar"}
                </Button>
              </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
