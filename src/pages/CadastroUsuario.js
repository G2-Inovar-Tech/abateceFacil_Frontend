import React, { useState } from "react";
import InputMask from "react-input-mask";
import Constants from "../components/Constant.js";
import {
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Container,
    Box,
    Typography,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
    Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastroUsuario() {
    const [formData, setFormData] = useState({
        name: "",
        type: "",
        phone: "",
        login: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nome é obrigatório.";
        if (!formData.type) newErrors.type = "Tipo é obrigatório.";
        const cleanedPhone = formData.phone.replace(/\D/g, '');
        if (!cleanedPhone || cleanedPhone.length < 10 || cleanedPhone.length > 15) {
            newErrors.phone = "Telefone inválido (apenas números, 10-15 dígitos).";
        }
        if (!formData.login.trim()) newErrors.login = "Login é obrigatório.";
        if (!formData.password) newErrors.password = "Senha é obrigatória.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showSnackbar("Por favor, corrija os erros no formulário.", "error");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const requestData = {
                nome: formData.name,
                tipo: formData.type,
                telefone: formData.phone,
                login: formData.login,
                senha: formData.password,
                status: "ATIVO",
                USU_DATA_VINCULACAO: new Date().toISOString(),
            };

            try {
                const response = await fetch(Constants.API_CADASTRAR_USUARIO, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*",
                        "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
                    },
                    body: JSON.stringify(requestData),
                });

                const responseData = await response.json();

                if (response.ok) {
                    showSnackbar("Usuário cadastrado com sucesso!", "success");
                    handleCancel(); // Limpa o formulário imediatamente
                } else {
                    const errorMessages = responseData.erros && typeof responseData.erros === "object"
                        ? Object.values(responseData.erros).flat().join(", ")
                        : responseData.message || "Erro desconhecido";

                    showSnackbar(`Erro ao cadastrar usuário: ${errorMessages}`, "error");
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                showSnackbar("Erro ao conectar com o servidor.", "error");
            }
        }
    };

    const handleCancel = () => {
        setFormData({
            name: "",
            type: "",
            phone: "",
            login: "",
            password: "",
        });
        setErrors({});
    };

    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <MainLayout>
            <Box
                sx={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    backgroundBlendMode: "overlay",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                            Cadastro de Usuário
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Nome */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        error={!!errors.name}
                                        helperText={errors.name}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange({ target: { name: "phone", value: e.target.value } })}
                                    >
                                        {(inputProps) => (
                                            <TextField
                                                {...inputProps}
                                                fullWidth
                                                label="Telefone"
                                                name="phone"
                                                error={!!errors.phone}
                                                helperText={errors.phone}
                                                margin="normal"
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                            />
                                        )}
                                    </InputMask>
                                </Grid>

                                {/* Tipo e Telefone */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl component="fieldset" fullWidth margin="normal">
                                        <FormLabel component="legend">Tipo</FormLabel>
                                        <RadioGroup
                                            row
                                            name="type"
                                            value={formData.type}
                                            onChange={handleInputChange}
                                        >
                                            <FormControlLabel value="ADM" control={<Radio />} label="ADM" />
                                            <FormControlLabel value="PREFEITURA" control={<Radio />} label="PREFEITURA" />
                                            <FormControlLabel value="POSTO" control={<Radio />} label="POSTO" />
                                        </RadioGroup>
                                        {errors.type && (
                                            <Typography color="error" variant="body2">
                                                {errors.type}
                                            </Typography>
                                        )}
                                    </FormControl>
                                </Grid>

                                {/* Login e Senha */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Login"
                                        name="login"
                                        value={formData.login}
                                        onChange={handleInputChange}
                                        error={!!errors.login}
                                        helperText={errors.login}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Senha"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        error={!!errors.password}
                                        helperText={errors.password}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={togglePasswordVisibility} edge="end">
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Botões */}
                            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", gap: 2 }}>
                                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel} fullWidth sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, height: "56px" }}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontSize: { xs: "0.875rem", sm: "1rem" }, height: "56px" }}>
                                    Cadastrar
                                </Button>
                            </Box>
                        </form>
                    </Box>
                </Container>

                {/* Snackbar para exibir mensagens de sucesso e erro */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleSnackbarClose}
                        severity={snackbarSeverity}
                        sx={{ width: "100%" }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </MainLayout>
    );
}