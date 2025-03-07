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

export default function RelatorioPosto() {
    const [postos, setPostos] = useState([]);
    const [filteredPostos, setFilteredPostos] = useState([]);
    const [selectedPosto, setSelectedPosto] = useState(null);
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [searchPostos, setSearchPostos] = useState("");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    useEffect(() => {
        const fetchPostos = async () => {
            try {
                const response = await fetch(Constants.API_CONSULTAR_POSTO, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (response.ok && data.postos) {
                    setPostos(data.postos);
                    setFilteredPostos(data.postos);
                } else {
                    setErrorMessage("Erro ao buscar postos");
                }
            } catch (error) {
                console.error("Erro ao conectar com o servidor:", error);
                setErrorMessage("Erro ao conectar com o servidor.");
            }
        };
        fetchPostos();
    }, []);

    useEffect(() => {
        if (searchPostos) {
            const filtered = postos.filter((posto) =>
                posto.POS_RAZAO_SOCIAL && posto.POS_RAZAO_SOCIAL.toLowerCase().includes(searchPostos.toLowerCase())
            );
            setFilteredPostos(filtered);
        } else {
            setFilteredPostos(postos);
        }
    }, [searchPostos, postos]);

    const handleGenerateReport = async () => {
        if (!selectedPosto || !dataInicio || !dataFim) {
            setErrorMessage("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const reportUrl = `${Constants.API_BASE_URL}/api/abastecimentosPosto?POS_ID=${selectedPosto.POS_ID}&data_inicio=${dataInicio}&data_fim=${dataFim}&tipo=stream`;

            const response = await fetch(reportUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/pdf" // Esperando resposta em PDF
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
                            Relatório de Posto
                        </Typography>
                        <Autocomplete
                            options={filteredPostos}
                            getOptionLabel={(option) => option.POS_RAZAO_SOCIAL || ""}
                            value={selectedPosto}
                            onChange={(_, newValue) => setSelectedPosto(newValue)}
                            onInputChange={(_, newInputValue) => setSearchPostos(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Posto"
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
