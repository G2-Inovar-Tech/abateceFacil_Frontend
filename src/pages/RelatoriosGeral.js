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
    const [orgaos, setOrgaos] = useState([]);
    const [selectedOrgao, setSelectedOrgao] = useState(null);
    const [porcentagem, setPorcentagem] = useState("");
    const [porcentagemTouched, setPorcentagemTouched] = useState(false);
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
   // console.log("Token:", token);

    // Buscar órgãos
    useEffect(() => {
        const fetchOrgaos = async () => {
            try {
                const response = await fetch(`${Constants.API_CONSULTAR_ORGAO}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "*/*",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    let orgaosArray = [];
                    if (Array.isArray(data)) {
                        orgaosArray = data;
                    } else if (data.orgaos && Array.isArray(data.orgaos)) {
                        orgaosArray = data.orgaos;
                    } else if (data.data && Array.isArray(data.data)) {
                        orgaosArray = data.data;
                    }
                    setOrgaos(orgaosArray);
                }
            } catch (error) {
                console.error("Erro ao buscar órgãos:", error);
                setErrorMessage("Erro ao buscar órgãos.");
            }
        };

        fetchOrgaos();
    }, [token]);

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
        if (!selectedPrefeitura || !dataInicio || !dataFim || !porcentagem) {
            setErrorMessage("Prefeitura, datas e porcentagem são obrigatórios.");
            return;
        }

        // Validar porcentagem
        const numericPorcentagem = Number(porcentagem.replace(',', '.'));
        if (isNaN(numericPorcentagem) || numericPorcentagem < 0 || numericPorcentagem > 100) {
            setErrorMessage("Porcentagem deve ser um número entre 0 e 100.");
            return;
        }
    
        let reportUrl = `${Constants.API_BASE_URL}/api/relatorioPrefeituras?PRE_ID=${selectedPrefeitura.PRE_ID}&data_inicio=${dataInicio}&data_fim=${dataFim}&tipo=stream`;
        
        // Adiciona órgão e porcentagem à URL se estiverem presentes
        if (selectedOrgao) {
            reportUrl += `&ORG_ID=${selectedOrgao.ORG_ID}`;
        }
        if (porcentagem) {
            // Converte vírgula para ponto antes de enviar
            const porcentagemFormatada = porcentagem.replace(',', '.');
            reportUrl += `&porcentagem=${porcentagemFormatada}`;
        }
    
        try {
            const response = await fetch(reportUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/pdf"
                }
            });
    
            if (response.ok) {
                const blob = await response.blob();
                const fileURL = URL.createObjectURL(blob);
                window.open(fileURL, "_blank");
            } else {
                setErrorMessage("Erro ao gerar o relatório.");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            setErrorMessage("Erro ao conectar com o servidor.");
        }
    };

    const handlePorcentagemChange = (e) => {
        const value = e.target.value;
        // Permite números, vírgula e ponto, mas apenas um separador decimal
        const cleanValue = value.replace(/[^\d.,]/g, '').replace(/(,|\.)/, '$1').replace(/(,|\.).*?(,|\.)/g, '$1');
        
        // Converte para número para validar o range (0-100)
        const numericValue = Number(cleanValue.replace(',', '.'));
        if (cleanValue === "" || (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 100)) {
            setPorcentagem(cleanValue);
        }
        setPorcentagemTouched(true);
    };

    const handlePorcentagemBlur = () => {
        setPorcentagemTouched(true);
    };

    const showPorcentagemError = porcentagemTouched && !porcentagem;

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
                        
                        {/* Campo de Órgão */}
                        <Autocomplete
                            options={orgaos}
                            getOptionLabel={(option) => 
                                option ? `${option.ORG_SIGLA} - ${option.ORG_DESCRICAO}` : ""
                            }
                            value={selectedOrgao}
                            onChange={(_, newValue) => setSelectedOrgao(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Órgão (Opcional)"
                                    fullWidth
                                    margin="normal"
                                />
                            )}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <strong>{option.ORG_SIGLA}</strong> - {option.ORG_DESCRICAO}
                                </li>
                            )}
                            filterOptions={(options, { inputValue }) => {
                                const filterValue = inputValue.toLowerCase();
                                return options.filter(
                                    option => 
                                        option.ORG_SIGLA.toLowerCase().includes(filterValue) ||
                                        option.ORG_DESCRICAO.toLowerCase().includes(filterValue)
                                );
                            }}
                        />

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
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
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Porcentagem"
                                    type="text"
                                    value={porcentagem}
                                    onChange={handlePorcentagemChange}
                                    onBlur={handlePorcentagemBlur}
                                    margin="normal"
                                    required
                                    error={showPorcentagemError}
                                    helperText={showPorcentagemError ? "Campo obrigatório" : "Valor entre 0 e 100"}
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
