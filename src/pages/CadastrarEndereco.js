import React, { useState, useEffect } from "react";
import Constants from "../components/Constant";
import {
    TextField,
    Button,
    Box,
    Container,
    Typography,
    Grid,
    Autocomplete,
    Snackbar,
    Alert,
    CircularProgress,
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import backgroundImage from "../assets/backgroundHome.png";
import axios from "axios";

// Função para formatar texto (maiúsculas e sem acentos)
const formatarTexto = (texto) => {
    return texto
        .normalize("NFD") // Remove acentos
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase(); // Converte para maiúsculas
};

// Função para formatar o CEP
const formatarCEP = (cep) => {
    cep = cep.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    if (cep.length > 5) {
        cep = cep.replace(/^(\d{5})(\d{1,3})/, "$1-$2"); // Aplica a máscara XXXXX-XXX
    }
    return cep;
};

export default function CadastrarEndereco() {
    const [formData, setFormData] = useState({
        logradouro: "",
        cep: "",
        estado: "",
        pais: "Brasil", // Valor padrão para o campo país
        cidade: ""
    });
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Estado para indicar carregamento
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    // Função para exibir o Snackbar
    const showSnackbar = (message, severity = "success") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    // Função para fechar o Snackbar
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Busca estados
    useEffect(() => {
        setLoading(true);
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
            .then(response => {
                const sortedStates = response.data.map(state => ({ id: state.id, nome: state.nome })).sort((a, b) => a.nome.localeCompare(b.nome));
                setEstados(sortedStates);
            })
            .catch(error => {
                console.error("Erro ao buscar estados:", error);
                showSnackbar("Erro ao carregar a lista de estados.", "error");
            })
            .finally(() => setLoading(false));
    }, []);

    // Busca cidades
    useEffect(() => {
        if (formData.estado) {
            const estadoSelecionado = estados.find(estado => estado.nome === formData.estado);
            if (estadoSelecionado) {
                setLoading(true);
                axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.id}/municipios`)
                    .then(response => {
                        const sortedCities = response.data.map(city => city.nome).sort();
                        setCidades(sortedCities);
                    })
                    .catch(error => {
                        console.error("Erro ao buscar cidades:", error);
                        showSnackbar("Erro ao carregar a lista de cidades.", "error");
                    })
                    .finally(() => setLoading(false));
            }
        }
    }, [formData.estado, estados]);

    // Validação do formulário
    const validate = () => {
        const newErrors = {};
        if (!formData.logradouro?.trim()) newErrors.logradouro = "Logradouro é obrigatório.";
        if (!formData.cep?.trim()) newErrors.cep = "CEP é obrigatório.";
        if (!formData.estado?.trim()) newErrors.estado = "Estado é obrigatório.";
        if (!formData.cidade?.trim()) newErrors.cidade = "Cidade é obrigatória.";
        setErrors(newErrors); // Atualiza o estado de erros

        return Object.keys(newErrors).length === 0; // Retorna true se não houver erros
    };

    // Limpar formulário
    const handleCancel = () => {
        setFormData({
            logradouro: "",
            cep: "",
            estado: "",
            pais: "Brasil", // Mantém "Brasil" como valor padrão
            cidade: ""
        });
    };

    // Enviar dados para a API
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const requestData = {
                END_LOGRADOURO: formatarTexto(formData.logradouro),
                END_CEP: formData.cep.trim(),
                END_ESTADO: formatarTexto(formData.estado),
                END_PAIS: formatarTexto(formData.pais),
                END_CIDADE: formatarTexto(formData.cidade),
            };

            try {
                const response = await fetch(Constants.API_CADASTRAR_ENDERECO, {
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
                    showSnackbar("Endereço cadastrado com sucesso!", "success");
                    handleCancel(); // Limpa o formulário
                } else {
                    const errorMessages = responseData.erros
                        ? Object.values(responseData.erros).flat().join(", ")
                        : "Erro desconhecido";
                    showSnackbar(`Erro ao cadastrar endereço: ${errorMessages}`, "error");
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                showSnackbar("Erro ao conectar com o servidor.", "error");
            }
        }
    };

    // Atualiza o campo CEP com formatação
    const handleCEPChange = (e) => {
        const { value } = e.target;
        const cepFormatado = formatarCEP(value);
        setFormData((prev) => ({ ...prev, cep: cepFormatado }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
                            Cadastro de Endereço
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            {/* Linha 1: Logradouro */}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Logradouro"
                                        name="logradouro"
                                        value={formData.logradouro}
                                        onChange={handleInputChange}
                                        margin="normal"
                                        error={!!errors.logradouro}
                                        helperText={errors.logradouro}
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                    />
                                </Grid>
                            </Grid>

                            {/* Linha 2: País e Estado */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="País"
                                        name="pais"
                                        value={formData.pais}
                                        margin="normal"
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                        disabled // Campo desabilitado, pois o valor é fixo
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={estados.map(e => e.nome)}
                                        value={formData.estado || ""} // Garante que o valor nunca seja null
                                        onChange={(_, newValue) => setFormData((prev) => ({ ...prev, estado: newValue || "", cidade: "" }))}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Estado"
                                                margin="normal"
                                                fullWidth
                                                error={!!errors.estado}
                                                helperText={errors.estado}
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            {/* Linha 3: CEP e Cidade */}
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="CEP"
                                        name="cep"
                                        value={formData.cep}
                                        onChange={handleCEPChange} // Usa a função de formatação
                                        margin="normal"
                                        error={!!errors.cep}
                                        helperText={errors.cep}
                                        size="medium"
                                        sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                        inputProps={{ maxLength: 9 }} // Limita o tamanho do CEP
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Autocomplete
                                        options={cidades}
                                        value={formData.cidade || ""} // Garante que o valor nunca seja null
                                        onChange={(_, newValue) => setFormData((prev) => ({ ...prev, cidade: newValue || "" }))}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Cidade"
                                                margin="normal"
                                                fullWidth
                                                error={!!errors.cidade}
                                                helperText={errors.cidade}
                                                size="medium"
                                                sx={{ "& .MuiInputBase-root": { height: "56px" } }}
                                            />
                                        )}
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

                {/* Snackbar para exibir mensagens de erro e sucesso */}
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

                {/* Indicador de carregamento */}
                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                        <CircularProgress />
                    </Box>
                )}
            </Box>
        </MainLayout>
    );
}