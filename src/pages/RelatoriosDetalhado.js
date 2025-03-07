import React, { useState, useEffect } from "react";
import Constants from "../components/Constant";
import {
    TextField,
    Button,
    Box,
    Container,
    Typography,
    Autocomplete,
    Snackbar,
    Alert,
    Grid,
} from "@mui/material";
import MainLayout from "../components/MainLayout";
import backgroundImage from "../assets/backgroundHome.png";

export default function RelatorioPrefeitura() {
    const [prefeituras, setPrefeituras] = useState([]);
    const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
    const [selectedPrefeitura, setSelectedPrefeitura] = useState(null);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [searchPrefeituras, setSearchPrefeituras] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity = "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        const fetchPrefeituras = async () => {
            try {
                const response = await fetch(Constants.API_CONSULTAR_PREFEITURA, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    }
                    
                });
                const data = await response.json();
                if (response.ok && data.prefeituras) {
                    setPrefeituras(data.prefeituras);
                    setFilteredPrefeituras(data.prefeituras);
                } else {
                    showSnackbar("Erro ao buscar prefeituras");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                showSnackbar("Erro ao conectar com o servidor.");
            }
        };
        fetchPrefeituras();
    }, []);

    useEffect(() => {
        if (searchPrefeituras) {
            const filtered = prefeituras.filter((prefeitura) =>
                prefeitura.PRE_NOME && prefeitura.PRE_NOME.toLowerCase().includes(searchPrefeituras.toLowerCase())
            );
            setFilteredPrefeituras(filtered);
        } else {
            setFilteredPrefeituras(prefeituras);
        }
    }, [searchPrefeituras, prefeituras]);

    const handleGenerateReport = async () => {
        if (!selectedPrefeitura || !dataInicio || !dataFim) {
            showSnackbar("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const reportUrl = `${Constants.API_BASE_URL}/api/abastecimentosPrefeitura?PRE_ID=${selectedPrefeitura.PRE_ID}&data_inicio=${dataInicio}&data_fim=${dataFim}&tipo=stream`;

            const response = await fetch(reportUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/pdf" // Alterado para esperar um PDF
                }
            });

            if (response.ok) {
                const blob = await response.blob(); // Obtemos o PDF como um blob
                const fileURL = URL.createObjectURL(blob); // Criamos um URL para o arquivo PDF

                // Abre o PDF em uma nova aba
                window.open(fileURL, "_blank");
            } else {
                showSnackbar("Erro ao gerar o relatório.");
            }
        } catch (error) {
            //console.error("Erro ao conectar com o servidor:", error);
            showSnackbar("Erro ao conectar com o servidor.");
        }
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
                            Relatório de Prefeitura
                        </Typography>
                        <Autocomplete
                            options={filteredPrefeituras}
                            getOptionLabel={(option) => option.PRE_NOME || ""}
                            value={selectedPrefeitura}
                            onChange={(_, newValue) => setSelectedPrefeitura(newValue)}
                            onInputChange={(_, newInputValue) => setSearchPrefeituras(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Prefeitura"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Data de Início"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Data de Fim"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                            <Button variant="contained" color="primary" onClick={handleGenerateReport}>
                                Gerar Relatório
                            </Button>
                        </Box>
                    </Box>
                </Container>
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
        </MainLayout>
    );
}
