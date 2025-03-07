import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useMediaQuery,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Divider,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";
import Constants from "../components/Constant.js";

export default function HistoricoPrefeitura() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [title, setTitle] = useState("Abastece Fácil - Prefeitura de ...");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [abastecimentos, setAbastecimentos] = useState([]);
  const [dataInicio, setDataInicio] = useState(dayjs().subtract(10, "day").format("YYYY-MM-DD"));
  const [dataFim, setDataFim] = useState(dayjs().format("YYYY-MM-DD"));
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear}-01-01`;
  const maxDate = `${currentYear}-12-31`;
  const [combustivelSelecionado, setCombustivelSelecionado] = useState("");
  const [combustiveis, setCombustiveis] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const idUsuario = localStorage.getItem("idUsuario") || sessionStorage.getItem("idUsuario");
    const idPrefeitura = localStorage.getItem("idPrefeitura") || sessionStorage.getItem("idPrefeitura");
    const profile = localStorage.getItem("profile") || sessionStorage.getItem("profile");
    const nomePrefeitura = localStorage.getItem("nomePrefeitura") || sessionStorage.getItem("nomePrefeitura");

    if (token) {
      setTitle("Abastece Fácil - Prefeitura de " + nomePrefeitura);
      setUserData({ token, idUsuario, idPrefeitura, profile });
    }
  }, []);

  useEffect(() => {
    if (userData?.token && userData?.idPrefeitura) {
      buscarHistorico();
    }
  }, [userData]);

  const buscarHistorico = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${Constants.API_BASE_URL}/api/listarAbastecimentosPrefeitura`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: "*/*",
          },
          params: {
            PRE_ID: userData.idPrefeitura,
            data_inicio: dataInicio,
            data_fim: dataFim,
          },
        }
      );

      const transformedData = response.data.abastecimentos.map((item) => ({
        dataTime: formatarDataHora(item.ABA_DATA_VINCULACAO),
        numeroCard: numeroCartaoFormatado(item.ABA_CAR_ID),
        combustivel: item.combustivel?.COM_DESCRICAO,
        litrosAbastecido: formatarValor(item.ABA_QNT_LITROS),
        precoLitro: formatarValor(item.ABA_PRECO_LITRO),
        total: formatarValor(item.ABA_VALOR_ABASTECIDO),
      }));

      setAbastecimentos(transformedData);
      setCombustiveis([...new Set(transformedData.map((item) => item.combustivel))]);
    } catch (error) {
      console.error("Erro ao buscar abastecimentos:", error);
      setAbastecimentos([]);
    }
    setLoading(false);
  };

  const downloadHistorico = async () => {
    try {
      const response = await axios.get(
        `${Constants.API_BASE_URL}/api/abastecimentosPrefeitura`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: "application/pdf",
          },
          params: {
            PRE_ID: userData.idPrefeitura,
            data_inicio: dataInicio,
            data_fim: dataFim,
          },
          responseType: "blob", // Importante para receber o PDF corretamente
        }
      );
  
      // Criar URL temporária do PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  
      // Abrir o PDF em uma nova aba
      window.open(url, "_blank");
  
      // Remover URL temporária após abrir
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao abrir o PDF:", error);
    }
  };

  const handleFiltrar = () => {
    buscarHistorico();
  };

  const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const horaFormatada = data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return `${dataFormatada} às ${horaFormatada}`;
  };

  const numeroCartaoFormatado = (id) => {
    let numCartao = `${id}`;
    if (numCartao.length === 1) return "000" + numCartao;
    else if (numCartao.length === 2) return "00" + numCartao;
    else if (numCartao.length === 3) return "0" + numCartao;
    else return numCartao;
  };

  const formatarValor = (valor) => Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <MainLayout titlePage={title} loading={loading}>
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backgroundBlendMode: "overlay",
          padding: isMobile ? 0.5 : 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Histórico de Abastecimentos
        </Typography>
        <Container maxWidth="md" sx={{ padding: isMobile ? 0 : 3 }}>
          <Paper
            elevation={3}
            sx={{
              padding: isMobile ? 2 : 4,
              borderRadius: 2,
              backgroundColor: "rgba(255, 255, 255, 1.0)",
            }}
          >
            {/* Filtros */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              gap={2}
              mb={3}
              alignItems="center"
            >
              <TextField
                label="Data de"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                fullWidth
                inputProps={{ min: minDate, max: maxDate }}
              />
              <TextField
                label="Data até"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                fullWidth
                inputProps={{ min: minDate, max: maxDate }}
              />
              <TextField
                select
                label="Combustível"
                value={combustivelSelecionado}
                onChange={(e) => setCombustivelSelecionado(e.target.value)}
                fullWidth
              >
                <MenuItem value="">Todos</MenuItem>
                {combustiveis.map((tipo, index) => (
                  <MenuItem key={index} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                onClick={handleFiltrar}
                fullWidth
                sx={{ height: 56 }}
              >
                Filtrar
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={downloadHistorico}
                fullWidth
                sx={{ height: 56 }}
              >
                Baixar Histórico (PDF)
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Exibição dos Dados */}
            {isMobile ? (
              // Layout para Mobile (Cards)
              <Box sx={{ maxHeight: "50vh", overflowY: "auto" }}>
                {abastecimentos.length > 0 ? (
                  abastecimentos
                    .filter((item) => !combustivelSelecionado || item.combustivel === combustivelSelecionado)
                    .map((item, index) => (
                      <Card key={index} sx={{ mb: 2, borderRadius: 2 }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold">
                            Data: {item.dataTime}
                          </Typography>
                          <Typography variant="body1">
                            Credencial: {item.numeroCard}
                          </Typography>
                          <Typography variant="body1">
                            Combustível: {item.combustivel}
                          </Typography>
                          <Typography variant="body1">
                            Litros: {item.litrosAbastecido} L
                          </Typography>
                          <Typography variant="body1">
                            Preço/Litro: R$ {item.precoLitro}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            Total: R$ {item.total}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))
                    .reverse()
                ) : (
                  <Typography variant="h6" color="gray" align="center">
                    Nenhum abastecimento encontrado!
                  </Typography>
                )}
              </Box>
            ) : (
              // Layout para Web (Tabela)
              <TableContainer component={Paper} sx={{ maxHeight: "50vh", overflowY: "auto" }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Credencial</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Combustível</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Litros</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Preço/Litro</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {abastecimentos.length > 0 ? (
                      abastecimentos
                        .filter((item) => !combustivelSelecionado || item.combustivel === combustivelSelecionado)
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.dataTime}</TableCell>
                            <TableCell>{item.numeroCard}</TableCell>
                            <TableCell>{item.combustivel}</TableCell>
                            <TableCell>{item.litrosAbastecido} L</TableCell>
                            <TableCell>R$ {item.precoLitro}</TableCell>
                            <TableCell>R$ {item.total}</TableCell>
                          </TableRow>
                        ))
                        .reverse()
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Nenhum abastecimento encontrado!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Container>
      </Box>
    </MainLayout>
  );
}