import React, { useState } from "react";
import Constants from "../components/Constant.js";
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    Snackbar,
    Alert,
    Grid,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastroOrgao() {
    const [formData, setFormData] = useState({
        nome: "",
        sigla: "",
    });

    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório.";
        if (!formData.sigla.trim()) newErrors.sigla = "Sigla é obrigatória.";

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSnackbarMessage("Por favor, corrija os erros no formulário.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validate()) {
            const requestData = {
                ORG_DESCRICAO: formData.nome.trim(),
                ORG_SIGLA: formData.sigla.trim(),
            };
    
           // console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));
    
            try {
                const response = await fetch(Constants.API_CADASTRAR_ORGAO, {
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
                    setSnackbarMessage("Órgão cadastrado com sucesso!");
                    setSnackbarSeverity("success");
                    setSnackbarOpen(true);
                    setTimeout(handleCancel, 2000); // Aguarda 2s antes de limpar o formulário
                } else {
                    if (responseData.erros) {
                        const errorMessages = Object.entries(responseData.erros)
                            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                            .join("; ");
                        setSnackbarMessage(`Erro ao cadastrar órgão: ${errorMessages}`);
                    } else {
                        setSnackbarMessage("Erro desconhecido ao cadastrar órgão.");
                    }
                    setSnackbarSeverity("error");
                    setSnackbarOpen(true);
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                setSnackbarMessage("Erro ao conectar com o servidor.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }
    };
    

    const handleCancel = () => {
        setFormData({ nome: "", sigla: "" }); // Limpa os campos do formulário
        setErrors({}); // Limpa os erros
    };

    const handleCloseSnackbar = () => {
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
                    padding: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Container maxWidth="md">
                    <Box sx={{ p: 4, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center">
                            Cadastro de Órgão
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}> {/* Espaçamento uniforme entre os campos */}
                                {/* Campo Nome */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        error={!!errors.nome}
                                        helperText={errors.nome}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>

                                {/* Campo Sigla */}
                                <Grid item xs={12} sm={4}> {/* Reduzi a largura para 4 colunas em telas maiores */}
                                    <TextField
                                        fullWidth
                                        label="Sigla"
                                        name="sigla"
                                        value={formData.sigla}
                                        onChange={handleInputChange}
                                        error={!!errors.sigla}
                                        helperText={errors.sigla}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Botões */}
                            <Grid container spacing={3} sx={{ mt: 2 }}> {/* Mesmo espaçamento para os botões */}
                                <Grid item xs={6}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCancel}
                                        fullWidth
                                        sx={{ height: "56px" }}
                                    >
                                        Cancelar
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ height: "56px" }}
                                    >
                                        Cadastrar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Container>

                {/* Snackbar para exibir mensagens de erro e sucesso */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </MainLayout>
    );
}