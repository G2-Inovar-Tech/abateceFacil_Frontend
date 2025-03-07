import React, { useState, useEffect } from "react";
import InputMask from "react-input-mask";
import Constants from "../components/Constant.js";
import {
    TextField,
    Button,
    Container,
    Box,
    Typography,
    Snackbar,
    Alert,
    MenuItem,
    Grid,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastroPosto() {
    const [formData, setFormData] = useState({
        razaosocial: "",
        cnpj: "",
        phone: "",
        saldo: "",
        endereco: "",
    });

    const [enderecos, setEnderecos] = useState([]);
    const [errors, setErrors] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        async function fetchEnderecos() {
            try {
                const response = await fetch(Constants.API_CONSULTAR_ENDERECO, {
                    headers: {
                        "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
                    }
                });
                const data = await response.json();
                if (data.status && Array.isArray(data.enderecos)) {
                    setEnderecos(data.enderecos);
                } else {
                    setEnderecos([]);
                }
            } catch (error) {
                setEnderecos([]);
            }
        }
        fetchEnderecos();
    }, [token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === "saldo") {
            // Remove tudo que não é número
            newValue = newValue.replace(/\D/g, "");

            // Se houver mais de três dígitos, separa os últimos três como decimais
            if (newValue.length > 3) {
                const integerPart = newValue.slice(0, -3).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                const decimalPart = newValue.slice(-3);
                newValue = `${integerPart},${decimalPart}`;
            }
        }

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const validate = () => {
        const newErrors = {};

        // Validação da razão social
        if (!formData.razaosocial.trim()) {
            newErrors.razaosocial = "Razão social é obrigatória.";
        }

        // Validação do CNPJ
        const cleanedCnpj = formData.cnpj.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (!cleanedCnpj || cleanedCnpj.length !== 14) {
            newErrors.cnpj = "CNPJ inválido (deve ter 14 dígitos).";
        }

        // Validação do telefone
        const cleanedPhone = formData.phone.replace(/\D/g, ""); // Remove caracteres não numéricos
        if (!cleanedPhone || cleanedPhone.length < 10 || cleanedPhone.length > 11) {
            newErrors.phone = "Telefone inválido (10-11 dígitos).";
        }

        // Validação do endereço
        if (!formData.endereco) {
            newErrors.endereco = "Endereço é obrigatório.";
        }

        // Validação do saldo
        if (!formData.saldo.trim() || !/^\d{1,3}(\.\d{3})*(,\d{1,3})?$/.test(formData.saldo)) {
            newErrors.saldo = "Saldo inválido (ex: 1.000,500).";
        }

        setErrors(newErrors);

        // Se houver erros, retorna false
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
                POS_RAZAO_SOCIAL: formData.razaosocial,
                POS_CNPJ: formData.cnpj,
                POS_TELEFONE: formData.phone,
                POS_SALDO_ATUAL: formData.saldo.replace(".", "").replace(",", "."), // Remove pontos e converte vírgula para ponto
                POS_END_ID: formData.endereco,
                POS_STATUS: "ATIVO",
            };

            try {
                const response = await fetch(Constants.API_CADASTRAR_POSTO, {
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
                    showSnackbar("Posto cadastrado com sucesso!", "success");
                    handleCancel();
                } else {
                    const errorMessages = responseData.erros
                        ? Object.values(responseData.erros).flat().join(", ")
                        : "Erro desconhecido";
                    showSnackbar(`Erro ao cadastrar Posto: ${errorMessages}`, "error");
                }
            } catch (error) {
                showSnackbar("Erro ao conectar com o servidor.", "error");
            }
        }
    };

    const handleCancel = () => {
        setFormData({ razaosocial: "", cnpj: "", phone: "", saldo: "", endereco: "" });
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
            <Box sx={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                backgroundBlendMode: "overlay",
                padding: 2,
                borderRadius: 2,
                boxShadow: 3,
            }}>
                <Container maxWidth="md">
                    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: "background.paper", borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}>
                            Cadastro de Posto
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Razão Social */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Razão Social"
                                        name="razaosocial"
                                        value={formData.razaosocial}
                                        onChange={handleInputChange}
                                        error={!!errors.razaosocial}
                                        helperText={errors.razaosocial}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>

                                {/* CNPJ e Telefone */}
                                <Grid item xs={12} sm={6}>
                                    <InputMask
                                        mask="99.999.999/9999-99"
                                        value={formData.cnpj}
                                        onChange={handleInputChange}
                                    >
                                        {(inputProps) => (
                                            <TextField
                                                {...inputProps}
                                                fullWidth
                                                label="CNPJ"
                                                name="cnpj"
                                                error={!!errors.cnpj}
                                                helperText={errors.cnpj}
                                                margin="normal"
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                            />
                                        )}
                                    </InputMask>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        value={formData.phone}
                                        onChange={handleInputChange}
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

                                {/* Endereço */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Endereço"
                                        name="endereco"
                                        value={formData.endereco}
                                        onChange={handleInputChange}
                                        error={!!errors.endereco}
                                        helperText={errors.endereco}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    >
                                        {enderecos && enderecos.length > 0 ? (
                                            enderecos.map((endereco) => (
                                                <MenuItem key={endereco.END_ID} value={endereco.END_ID}>
                                                    {`${endereco.END_LOGRADOURO}, ${endereco.END_CEP}, ${endereco.END_CIDADE}, ${endereco.END_ESTADO}`}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled value="">
                                                Nenhum endereço disponível
                                            </MenuItem>
                                        )}
                                    </TextField>
                                </Grid>

                                {/* Saldo */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        label="Saldo"
                                        name="saldo"
                                        value={formData.saldo}
                                        onChange={handleInputChange}
                                        error={!!errors.saldo}
                                        helperText={errors.saldo}
                                        margin="normal"
                                        fullWidth
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                        inputProps={{ inputMode: "numeric" }}
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
            </Box>

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
        </MainLayout>
    );
}