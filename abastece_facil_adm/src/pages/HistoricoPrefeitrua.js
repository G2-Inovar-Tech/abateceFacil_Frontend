import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Button,
  Divider,
  Container,
} from "@mui/material";
import dayjs from "dayjs";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";

export default function HistoricoPrefeitura() {
  const [title, setTitle] = useState("Abastece Fácil - Prefeitura de ...");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  const [abastecimentos, setAbastecimentos] = useState([]);
  const [dataInicio, setDataInicio] = useState(dayjs().subtract(10, "day").format("YYYY-MM-DD"));
  const [dataFim, setDataFim] = useState(dayjs().format("YYYY-MM-DD"));
  const [combustivelSelecionado, setCombustivelSelecionado] = useState("");
  const [combustiveis, setCombustiveis] = useState([]);

  // setTimeout(() => { // Simula um atraso de 2 segundos para carregar os dados
  //     setTitle("Abastece Fácil - Prefeitura de " + "Abaira");
  //     setLoading(false);
  // }, 1000);
  useEffect(() => {
    // Pegando os dados do usuário logado
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
        `https://g2inovartech.com.br/api/listarAbastecimentosPrefeitura`,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            Accept: "*/*",
          },
          params: {
            PRE_ID: 2, //userData.idPrefeitura,
            data_inicio: dataInicio,
            data_fim: dataFim,
          },
        }
      );

      const transformedData = response.data.abastecimentos.map((item) => ({
        dataTime: formatarDataHora(item.ABA_DATA_VINCULACAO),
        numeroCard: formatarNumeroCartao(item.ABA_CAR_ID),
        combustivel: item.combustivel?.COM_DESCRICAO,
        litrosAbastecido: formatarValor(item.ABA_QNT_LITROS),
        precoLitro: formatarValor(item.ABA_PRECO_LITRO),
        total: formatarValor(item.ABA_VALOR_ABASTECIDO),
      }));

      setAbastecimentos(transformedData);
      setCombustiveis([
        ...new Set(transformedData.map((item) => item.combustivel)),
      ]); // Lista de combustíveis únicos
    } catch (error) {
      console.error("Erro ao buscar abastecimentos:", error);
      console.log(error);
      const errorMessage = error.response?.data?.message || "Erro ao buscar dados. Tente novamente.";
      //alert("Erro:\n" + errorMessage);
      console.log("Erro: " + errorMessage);
      setAbastecimentos([]);
    }
    setLoading(false);
  };

  const handleFiltrar = () => {
    buscarHistorico();
  };

  const formatarDataHora = (data) => dayjs(data).format("DD/MM/YYYY HH:mm");
  const formatarNumeroCartao = (id) => `Cartão ${id}`;
  const formatarValor = (valor) => Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <MainLayout titlePage={title} loading={loading}>
      {/* <Box>
        <Typography variant="h3">Histórico</Typography>
        <Typography variant="body1">Nenhum dado encontrado!</Typography>
      </Box> */}
      <Box
        sx={{
          flexGrow: 1, // Faz com que ocupe o restante do espaço vertical.
          backgroundImage: `url(${backgroundImage})`,
          backgroundColor: "rgba(255, 255, 255, 0.8)", // Cor branca com transparência.
          backgroundBlendMode: "overlay", // Mistura o background transparente com a imagem.
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Histórico de Abastecimentos
        </Typography>
        <Container maxWidth="md">
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "rgba(255, 255, 255, 1.0)",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {/* Filtros */}
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              gap={2}
              my={3}
              sx={{
                maxWidth:
                  "400px" /* , justifyContent: "flex-end" isso tem que está no box pai */,
                //maxHeight: "100px",
              }}
            >
              <TextField
                label="Data de"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                fullWidth
              />
              <TextField
                label="Data até"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                fullWidth
              />
              {/* <TextField
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
              </TextField> */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleFiltrar}
              >
                Filtrar
              </Button>
            </Box>
            {/* <Divider sx={{ my: 2 }} /> */}
            <Divider
              sx={{
                my: 2,
                borderRadius: "10px",
                borderBottomWidth: "medium",
              }}
            />

            {/* Lista de Abastecimentos */}
            {abastecimentos.length > 0 ? (
              abastecimentos
                .filter(
                  (item) =>
                    !combustivelSelecionado ||
                    item.combustivel === combustivelSelecionado
                )
                .map((item, index) => (
                  <Card key={index} sx={{ mb: 2, p: 2 }}>
                    <CardContent>
                      <Typography variant="h6">
                        Data: {item.dataTime}
                      </Typography>
                      <Typography>Cartão: {item.numeroCard}</Typography>
                      <Typography>Combustível: {item.combustivel}</Typography>
                      <Typography>Litros: {item.litrosAbastecido} L</Typography>
                      <Typography>Preço/Litro: R$ {item.precoLitro}</Typography>
                      <Typography>
                        <strong>Total: R$ {item.total}</strong>
                      </Typography>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <Box // ====== Nenhuma abastecimento encontrado! ======
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "30vh",
                  textAlign: "center",
                }}
              >
                <Typography variant="h6" sx={{ mb: 4 }} color="gray">
                  Nenhuma abastecimento encontrado!
                </Typography>
              </Box>
            )}
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
