import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Constants from "../components/Constant.js";
import {
  TextField,
  Button,
  Box,
  Container,
  Typography,
  useMediaQuery,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/system";
import SmallLoader from "../components/SmallLoader.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleAccess = (profile) => {
    if (profile === "ADM") {
      navigate(location.state?.from?.pathname || "/home");
    } else if (profile === "PREFEITURA") {
      navigate(location.state?.from?.pathname || "/home-prefeitura");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Usuário é obrigatório.";
    if (!formData.password.trim()) newErrors.password = "Senha é obrigatória.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setLoading(true);
    if (!validate()) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post(
        Constants.API_LOGIN,
        { login: formData.username, password: formData.password, tipo: "web" },
        { headers: { "Content-Type": "application/json", "Accept": "*/*" } }
      );
  
      const { token, user } = response.data;
  
      // Armazenar o token e o ID da prefeitura no localStorage
      localStorage.setItem("token", token);
      if (user.PRE_ID) {
        localStorage.setItem("prefeituraId", user.PRE_ID);
      }
  
      // Chamar a função de login do contexto de autenticação
      login(false, user.USU_TIPO, {
        token,
        idUsuario: `${user.USU_ID}`,
        idPrefeitura: user.PRE_ID ? `${user.PRE_ID}` : "",
        idAdm: user.ADM_ID ? `${user.ADM_ID}` : "",
        nomePrefeitura: user.PRE_NOME || "",
      });
  
      // Redirecionar o usuário com base no perfil
      handleAccess(user.USU_TIPO);
  
      // Exibir mensagem de sucesso
      showSnackbar("Login realizado com sucesso!", "success");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Erro ao realizar login. Tente novamente.";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // Snackbar functions
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  React.useEffect(() => {
    if (isAuthenticated) navigate("/home", { replace: true });
  }, [isAuthenticated, navigate]);

  const LeftImage = styled("div")(({ theme }) => ({
    flex: 1,
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    [theme.breakpoints.down("sm")]: { flex: 0, height: "40vh" },
  }));

  return (
    <Box display="flex" height="100vh" sx={{ backgroundImage: isSmallScreen ? `url(${backgroundImage})` : "none", backgroundColor: "rgba(255, 255, 255, 0.8)", backgroundBlendMode: "overlay" }}>
      {!isSmallScreen && <LeftImage />}
      <Container maxWidth="xs" sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", flex: 1, padding: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom align="center" color={isSmallScreen ? "#02153D" : "#808A9E"} sx={{ fontWeight: "700", textTransform: "uppercase" }}>
            Gestão Abastece Fácil
          </Typography>
          <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              Login
            </Typography>
            <TextField
              fullWidth
              label="Usuário"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              error={!!errors.username}
              helperText={errors.username}
              margin="normal"
            />
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Senha"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              error={!!errors.password}
              helperText={errors.password}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ backgroundColor: "#808A9E" }}
                disabled={loading}
                onClick={handleLogin}
              >
                {loading ? <SmallLoader size={20} /> : "Acessar"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Snackbar para mensagens de erro e sucesso */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}