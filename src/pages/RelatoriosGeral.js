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

export default function RelatorioGeral() {
    const [prefeituras, setPrefeituras] = useState([]);
    const [filteredPrefeituras, setFilteredPrefeituras] = useState([]);
    const [selectedPrefeitura, setSelectedPrefeitura] = useState(null);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [searchPrefeituras, setSearchPrefeituras] = useState("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
   // console.log("Token:", token);


    useEffect(() => {
        const fetchPrefeituras = async () => {
            try {
                const response = await fetch(`${Constants.API_BASE_URL}/api/prefeitura`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "application/json",
                        "X-Auth-Token": token, // Caso a API use um cabeçalho customizado
                    },
                    
                });
                const data = await response.json();
                if (response.ok && data.prefeituras) {
                    setPrefeituras(data.prefeituras);
                    setFilteredPrefeituras(data.prefeituras);
                } else {
                    setErrorMessage("Erro ao buscar prefeituras.");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                setErrorMessage("Erro ao conectar com o servidor.");
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
            setErrorMessage("Todos os campos são obrigatórios.");
            return;
        }
    
       // console.log("Token enviado:", token);
        const reportUrl = `${Constants.API_BASE_URL}/api/relatorioPrefeituras?PRE_ID=${selectedPrefeitura.PRE_ID}&data_inicio=${dataInicio}&data_fim=${dataFim}&tipo=stream`;
    
        try {
            const response = await fetch(reportUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/pdf" // Esperando um PDF como resposta
                }
            });
    
           // console.log("Resposta da API:", response);
           // console.log("Status da API:", response.status);
    
            if (response.ok) {
                const blob = await response.blob(); // Obtemos o conteúdo binário (PDF)
                const fileURL = URL.createObjectURL(blob); // Criamos um URL para o blob
    
                // Abre o PDF em uma nova aba
                window.open(fileURL, "_blank");
            } else {
                setErrorMessage("Erro ao gerar o relatório.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            setErrorMessage("Erro ao conectar com o servidor.");
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
                            Relatório Geral de Prefeituras
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
                    open={!!errorMessage}
                    autoHideDuration={6000}
                    onClose={() => setErrorMessage("")}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={() => setErrorMessage("")} severity="error" sx={{ width: "100%" }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </MainLayout>
    );
}
