import React, { useState, useEffect } from "react";
import Constants from "../components/Constant";
import {
    TextField,
    Button,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Container,
    Typography,
    Grid,
    Autocomplete,
    Snackbar,
    Alert,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import MainLayout from "../components/MainLayout";
import backgroundImage from "../assets/backgroundHome.png";

export default function CadastroCartao() {
    const [formData, setFormData] = useState({
        prefeitura: "",
        senha: "",
        status: "ATIVO",
        tipo: "",
        orgaoResponsavel: "",
    });

    const [errors, setErrors] = useState({});
    const [prefeituras, setPrefeituras] = useState([]);
    const [orgaos, setOrgaos] = useState([]);
    const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
    const [filteredOrgaos, setFilteredOrgaos] = useState([]);
    const [searchPrefeitura, setSearchPrefeitura] = useState("");
    const [searchOrgao, setSearchOrgao] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const [showPassword, setShowPassword] = useState(false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    // Fetch para prefeituras
    useEffect(() => {
        const fetchPrefeituras = async () => {
            try {
                const response = await fetch(Constants.API_CONSULTAR_PREFEITURA, {
                    headers: {
                        "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
                    }
                });
                const data = await response.json();
               // console.log("Dados das prefeituras recebidos:", data);

                if (response.ok) {
                    setPrefeituras(data.prefeituras);
                    setFilteredPrefeituras(data.prefeituras);
                } else {
                    const errorMessages = data.erros
                        ? Object.values(data.erros).flat().join(", ")
                        : "Erro desconhecido";
                    showSnackbar(`Erro ao buscar prefeituras: ${errorMessages}`, "error");
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                showSnackbar("Erro ao conectar com o servidor.", "error");
            }
        };

        fetchPrefeituras();
    }, [token]);

    // Fetch para órgãos responsáveis
    useEffect(() => {
        const fetchOrgaos = async () => {
            try {
                const response = await fetch(Constants.API_CONSULTAR_ORGAO, {
                    headers: {
                        "Authorization": `Bearer ${token}` // Adiciona o token no cabeçalho
                    }
                });
                const data = await response.json();
              //  console.log("Dados dos órgãos recebidos:", data);

                if (response.ok) {
                    const orgaosArray = Array.isArray(data) ? data : data.orgaos || [];
                    setOrgaos(orgaosArray);
                    setFilteredOrgaos(orgaosArray);
                } else {
                    const errorMessages = data.erros
                        ? Object.values(data.erros).flat().join(", ")
                        : "Erro desconhecido";
                    showSnackbar(`Erro ao buscar órgãos: ${errorMessages}`, "error");
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                showSnackbar("Erro ao conectar com o servidor.", "error");
            }
        };

        fetchOrgaos();
    }, [token]);

    // Filtra prefeituras com base no valor digitado
    useEffect(() => {
        if (searchPrefeitura) {
            const filtered = prefeituras.filter((prefeitura) =>
                prefeitura.PRE_NOME.toLowerCase().includes(searchPrefeitura.toLowerCase())
            );
            setFilteredPrefeituras(filtered);
        } else {
            setFilteredPrefeituras(prefeituras);
        }
    }, [searchPrefeitura, prefeituras]);

    // Filtra órgãos com base no valor digitado
    useEffect(() => {
        if (searchOrgao) {
            const filtered = orgaos.filter((orgao) =>
                orgao.ORG_DESCRICAO.toLowerCase().includes(searchOrgao.toLowerCase())
            );
            setFilteredOrgaos(filtered);
        } else {
            setFilteredOrgaos(orgaos);
        }
    }, [searchOrgao, orgaos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.prefeitura) newErrors.prefeitura = "Prefeitura é obrigatória.";
        if (!formData.senha.trim()) newErrors.senha = "Senha é obrigatória.";
        if (!formData.orgaoResponsavel) newErrors.orgaoResponsavel = "Órgão Responsável é obrigatório.";
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            showSnackbar("Por favor, corrija os erros no formulário.", "error");
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        setFormData({
            prefeitura: "",
            senha: "",
            status: "ATIVO",
            tipo: "",
            orgaoResponsavel: "",
        });
        setSearchPrefeitura("");
        setSearchOrgao("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const requestData = {
                CAR_PRE_ID: formData.prefeitura,
                CAR_SENHA: formData.senha,
                CAR_STATUS: "ATIVO",
                CAR_TIPO: formData.tipo,
                CAR_ID_ORGAO_RESP: formData.orgaoResponsavel,
            };

          //  console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

            try {
                const response = await fetch(Constants.API_CADASTRAR_CARTAO, {
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
                    showSnackbar("Cartão cadastrado com sucesso!", "success");
                    handleCancel(); // Limpa o formulário após o sucesso
                } else {
                    const errorMessages = responseData.erros
                        ? Object.values(responseData.erros).flat().join(", ")
                        : "Erro desconhecido";
                    showSnackbar(`Erro ao cadastrar cartão: ${errorMessages}`, "error");
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                showSnackbar("Erro ao conectar com o servidor.", "error");
            }
        }
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
                            Cadastro de Cartão
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Prefeitura */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={filteredPrefeituras}
                                        getOptionLabel={(option) => option.PRE_NOME}
                                        value={prefeituras.find((prefeitura) => prefeitura.PRE_ID === formData.prefeitura) || null}
                                        onChange={(_, newValue) => {
                                            setFormData((prev) => ({ ...prev, prefeitura: newValue ? newValue.PRE_ID : "" }));
                                        }}
                                        onInputChange={(_, newInputValue) => {
                                            setSearchPrefeitura(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Prefeitura"
                                                fullWidth
                                                margin="normal"
                                                error={!!errors.prefeitura}
                                                helperText={errors.prefeitura}
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Órgão Responsável */}
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={filteredOrgaos}
                                        getOptionLabel={(option) => option.ORG_DESCRICAO}
                                        value={orgaos.find((orgao) => orgao.ORG_ID === formData.orgaoResponsavel) || null}
                                        onChange={(_, newValue) => {
                                            setFormData((prev) => ({ ...prev, orgaoResponsavel: newValue ? newValue.ORG_ID : "" }));
                                        }}
                                        onInputChange={(_, newInputValue) => {
                                            setSearchOrgao(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Órgão Responsável"
                                                fullWidth
                                                margin="normal"
                                                error={!!errors.orgaoResponsavel}
                                                helperText={errors.orgaoResponsavel}
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Senha e Tipo */}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Senha"
                                        name="senha"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.senha}
                                        onChange={handleInputChange}
                                        error={!!errors.senha}
                                        helperText={errors.senha}
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

                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth margin="normal">
                                        <FormLabel>Tipo</FormLabel>
                                        <RadioGroup
                                            row
                                            name="tipo"
                                            value={formData.tipo}
                                            onChange={(e) => handleInputChange({ target: { name: "tipo", value: e.target.value } })}
                                        >
                                            <FormControlLabel value="COMUM" control={<Radio />} label="Comum" />
                                            <FormControlLabel value="MASTER" control={<Radio />} label="Master" />
                                        </RadioGroup>
                                    </FormControl>
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