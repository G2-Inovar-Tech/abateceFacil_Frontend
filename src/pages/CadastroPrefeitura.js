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
    Grid,
    MenuItem,
} from "@mui/material";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastroPrefeitura() {
    const [formData, setFormData] = useState({
        nomefantasia: "",
        razaosocial: "",
        email: "",
        phone: "",
        saldo: "",
        endereco: ""
    });

    const [enderecos, setEnderecos] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);
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
        if (!formData.nomefantasia.trim()) newErrors.nomefantasia = "Nome Fantasia é obrigatório";
        if (!formData.razaosocial.trim()) newErrors.razaosocial = "Razão social é obrigatório.";
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "E-mail inválido.";
        if (!formData.endereco) newErrors.endereco = "Endereço é obrigatório.";
    
        const cleanedPhone = formData.phone.replace(/\D/g, '');
        if (!cleanedPhone || cleanedPhone.length < 10 || cleanedPhone.length > 15) {
            newErrors.phone = "Telefone inválido (apenas números, 10-15 dígitos).";
        }
        if (!formData.saldo.trim() || !/^\d{1,}(\.\d{3})*(,\d+)?$/.test(formData.saldo)) newErrors.saldo = "Saldo inválido (ex: 10.000,500).";
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length > 0) {
            setErrorMessage("Por favor, corrija os erros no formulário.");
            setOpenSnackbar(true);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validate()) {
            const requestData = {
                PRE_NOME: formData.nomefantasia,
                PRE_RAZAO_SOCIAL: formData.razaosocial,
                PRE_TELEFONE: formData.phone,
                PRE_EMAIL: formData.email,
                PRE_SALDO_ATUAL: formData.saldo.replace(/\./g, "").replace(",", "."), // Remove pontos e troca vírgula por ponto
                PRE_ENDERECO: formData.endereco,
            };
    
            try {
                const response = await fetch(Constants.API_CADASTRAR_PREFEITURA, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(requestData),
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    setSuccessMessage(data.message || "Prefeitura cadastrada com sucesso!");
                    setErrorMessage(""); // Limpa qualquer mensagem de erro anterior
                    setOpenSnackbar(true);
                    handleCancel();
                } else {
                    setErrorMessage(data.message || "Erro ao cadastrar Prefeitura."); 
                    setSuccessMessage(""); // Garante que o snackbar não exiba mensagem de sucesso incorretamente
                    setOpenSnackbar(true);
                }
            } catch (error) {
                setErrorMessage("Erro ao conectar com o servidor.");
                setSuccessMessage(""); 
                setOpenSnackbar(true);
            }
        }
    };
    

    const handleCancel = () => {
        setFormData({ nomefantasia: "", razaosocial: "", email: "", phone: "", saldo: "", endereco: "" });
        setErrors({});
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
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
                            Cadastro de Prefeitura
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Razão Social e Nome Fantasia */}
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
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nome Fantasia"
                                        name="nomefantasia"
                                        value={formData.nomefantasia}
                                        onChange={handleInputChange}
                                        error={!!errors.nomefantasia}
                                        helperText={errors.nomefantasia}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
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

                                {/* E-mail */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="E-mail"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>

                                {/* Telefone e Saldo */}
                                <Grid item xs={12} sm={6}>
                                    <InputMask mask="(99) 99999-9999" value={formData.phone} onChange={handleInputChange}>
                                        {(inputProps) => (
                                            <TextField
                                                {...inputProps}
                                                label="Telefone"
                                                name="phone"
                                                fullWidth
                                                error={!!errors.phone}
                                                helperText={errors.phone}
                                                margin="normal"
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                                inputProps={{ inputMode: "tel" }}
                                            />
                                        )}
                                    </InputMask>
                                </Grid>
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
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={successMessage ? "success" : "error"}
                    sx={{ width: "100%" }}
                >
                    {successMessage || errorMessage}
                </Alert>
            </Snackbar>
        </MainLayout>
    );
}