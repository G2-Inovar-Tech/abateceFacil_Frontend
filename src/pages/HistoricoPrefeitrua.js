import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useMediaQuery,
  Box,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Button,
  Divider,
  Container,
  styled,
} from "@mui/material";
import dayjs from "dayjs";
import MainLayout from "../components/MainLayout.js";
import backgroundImage from "../assets/backgroundHome.png";
import { AlignVerticalCenter } from "@mui/icons-material";
import { alignProperty } from "@mui/material/styles/cssUtils.js";

export default function HistoricoPrefeitura() {
  const isMobile = useMediaQuery("(max-width:600px)"); // Detecta telas pequenas
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

  const downloadHistorico = async () => {
    try {
      const response = await axios.get(
        `https://g2inovartech.com.br/api/abastecimentosPrefeitura`,
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
      
      // Criar um link e simular o clique
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Histórico_Abastecimentos_${dataInicio}_a_${dataFim}.pdf`); // Nome do arquivo
      document.body.appendChild(link);
      link.click();

      // Remover URL temporária
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar o PDF:", error);
      console.log(error);
    }
  };

  const handleFiltrar = () => {
    buscarHistorico();
  };

  //const formatarDataHora = (data) => dayjs(data).format("DD/MM/YYYY HH:mm");

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
    if(numCartao.length === 1)
      return "000" + numCartao;
    else if(numCartao.length === 2)
      return "00" + numCartao;
    else if(numCartao.length === 3)
      return "0" + numCartao;
    else
      return numCartao;
  };
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
          padding: isMobile ? 0.5 : 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Histórico de Abastecimentos
        </Typography>
        <Container maxWidth="md" sx={{ padding: isMobile ? 0 : 3 }}>
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "rgba(255, 255, 255, 1.0)",
              padding: isMobile ? 0.5 : 3,
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
                alignItems: "center",
                //maxWidth: "600px", 
                //justifyContent: "flex-end", isso tem que está no box pai
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
                sx={{minWidth: 80, height: 30}}
              >
                Filtrar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={downloadHistorico}
                sx={{minWidth: 210, height: 30}}
              >
                {"Baixar Histórico (PDF)"}
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
            <ScrollableBox>
              {abastecimentos.length > 0 ? (
                abastecimentos
                  .filter(
                    (item) =>
                      !combustivelSelecionado ||
                      item.combustivel === combustivelSelecionado
                  )
                  .map((item, index) => (
                    <Card
                      key={index}
                      sx={{
                        m: 1,
                        p: 2,
                        //pb: 0,
                        borderRadius: 10,
                        backgroundColor: "#D9D9D9",
                      }}
                    >
                      <CardContent
                        sx={{ p: 0, m: 0, mb: 0, pb: "0 !important" }}
                      >
                        <Box
                          sx={[
                            styles.linhaTituloCard,
                            {
                              flexDirection: isMobile ? "column" : "row",
                              display: isMobile ? "flex" : "flex",
                            },
                          ]}
                        >
                          <Typography sx={styles.cardTextLabel}>
                            Abastecimento:
                          </Typography>
                          <Typography sx={styles.cardTextValores}>
                            {item.dataTime}
                          </Typography>
                        </Box>
                        <Box sx={styles.linhaConteudoCard}>
                          <Typography sx={styles.cardTextLabel} alignCenter>
                            Credencial usada:
                          </Typography>
                          <Typography sx={styles.cardTextValores} alignCenter>
                            {item.numeroCard}
                          </Typography>
                        </Box>
                        <Box
                          sx={[
                            styles.linhaConteudoCardDois,
                            {
                              flexDirection: isMobile ? "column" : "row",
                              display: isMobile ? "flow" : "flex",
                            },
                          ]}
                        >
                          <Box sx={[styles.linhaConteudoCard, { flex: 0.7 }]}>
                            <Typography sx={styles.cardTextLabel} alignCenter>
                              Combustível:
                            </Typography>
                            <Typography sx={styles.cardTextValores} alignCenter>
                              {item.combustivel}
                            </Typography>
                          </Box>
                          <Box sx={[styles.linhaConteudoCard, { flex: 0.3 }]}>
                            <Typography sx={styles.cardTextLabel} alignCenter>
                              Litros:
                            </Typography>
                            <Typography sx={styles.cardTextValores} alignCenter>
                              {item.litrosAbastecido} L
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={[
                            styles.linhaConteudoCardDois,
                            {
                              flexDirection: isMobile ? "column" : "row",
                              display: isMobile ? "flow" : "flex",
                            },
                          ]}
                        >
                          <Box sx={[styles.linhaConteudoCard, { flex: 0.7 }]}>
                            <Typography sx={styles.cardTextLabel} alignCenter>
                              Preço/Litro:
                            </Typography>
                            <Typography sx={styles.cardTextValores} alignCenter>
                              R$ {item.precoLitro}
                            </Typography>
                          </Box>
                          <Box sx={[styles.linhaConteudoCard, { flex: 0.3 }]}>
                            <Typography sx={styles.cardTextLabel} alignCenter>
                              Total:
                            </Typography>
                            <Typography sx={styles.cardTextValores} alignCenter>
                              R$ {item.total}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                  .reverse()
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
            </ScrollableBox>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}

const ScrollableBox = styled(Box)(({ theme }) => ({
  maxHeight: '50vh', // Ajuste a altura máxima conforme necessário (ex: 50% da viewport)
  overflowY: 'auto',  // Adiciona a barra de rolagem vertical quando necessário
  // Ou overflowY: 'scroll' para sempre mostrar a barra de rolagem.
  [theme.breakpoints.down('md')]: { // Estilos para telas menores (opcional)
    maxHeight: '50vh', // Ajuste para mobile se precisar
  },
}));

const styles = {
  list: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 10,
    marginBottom: 12,
    elevation: 3, // Para sombra no Android
    shadowColor: "#000", // Para sombra no iOS
    shadowOffset: { width: 0, height: 2 }, // Para sombra no iOS
    shadowOpacity: 0.25, // Para sombra no iOS
    shadowRadius: 3.84, // Para sombra no iOS
  },
  linhaTituloCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    columnGap: 2,
    alignItems: "center",
  },
  linhaConteudoCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: "10px",
    columnGap: 2,
    alignItems: "center",
  },
  linhaConteudoCardDois: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    // marginTop: "10px",
    // columnGap: "30px",
    alignItems: "center",
  },
  cardTextLabel: {
    fontSize: 18,
    color: "#333333",
    fontWeight: "bold",
  },
  cardTextValores: {
    fontSize: 18,
    color: "#333333",
  },
};
