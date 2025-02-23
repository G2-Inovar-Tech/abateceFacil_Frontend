import React, { useState, useEffect } from "react";
import { TextField, Button, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, Select, InputLabel, Container, Typography, Grid, Autocomplete } from "@mui/material";
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
  const [orgaos, setOrgaos] = useState([]); // Estado para órgãos responsáveis
  const [filteredPrefeituras, setFilteredPrefeituras] = useState([]); // Estado para prefeituras filtradas
  const [filteredOrgaos, setFilteredOrgaos] = useState([]); // Estado para órgãos filtrados
  const [searchPrefeitura, setSearchPrefeitura] = useState(""); // Estado para o valor digitado na busca de prefeituras
  const [searchOrgao, setSearchOrgao] = useState(""); // Estado para o valor digitado na busca de órgãos

  // Fetch para prefeituras
  useEffect(() => {
    const fetchPrefeituras = async () => {
      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/prefeitura");
        const data = await response.json();
        console.log("Dados das prefeituras recebidos:", data);

        if (response.ok) {
          setPrefeituras(data.prefeituras);
          setFilteredPrefeituras(data.prefeituras); // Inicializa a lista filtrada com todas as prefeituras
        } else {
          const errorMessages = data.erros
            ? Object.values(data.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao buscar prefeituras: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
    };

    fetchPrefeituras();
  }, []);

  // Fetch para órgãos responsáveis (substitua por sua própria API ou lista estática)
  useEffect(() => {
    // Exemplo de dados fixos de órgãos responsáveis
    const orgaosData = [
      { id: "1", nome: "Órgão A" },
      { id: "2", nome: "Órgão B" },
      { id: "3", nome: "Órgão C" },
    ];
    setOrgaos(orgaosData);
    setFilteredOrgaos(orgaosData); // Inicializa a lista filtrada com todos os órgãos
  }, []);

  // Função para filtrar prefeituras com base no valor digitado
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

  // Função para filtrar órgãos com base no valor digitado
  useEffect(() => {
    if (searchOrgao) {
      const filtered = orgaos.filter((orgao) =>
        orgao.nome.toLowerCase().includes(searchOrgao.toLowerCase())
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
    if (!formData.orgaoResponsavel) newErrors.orgaoResponsavel = "Órgão Responsável é obrigatório."; // Validação para o órgão responsável
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      console.log("Dados enviados para a API:", JSON.stringify(requestData, null, 2));

      try {
        const response = await fetch("http://test.api.g2abastecimento.com.br/api/cartao", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
          },
          body: JSON.stringify(requestData),
        });

        const responseData = await response.json();

        if (response.ok) {
          alert(responseData.message || "Cartão cadastrado com sucesso!");
          handleCancel();
        } else {
          const errorMessages = responseData.erros
            ? Object.values(responseData.erros).flat().join(", ")
            : "Erro desconhecido";
          alert(`Erro ao cadastrar cartão: ${errorMessages}`);
        }
      } catch (error) {
        console.error("Erro ao enviar dados:", error);
        alert("Erro ao conectar com o servidor.");
      }
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
              Cadastro de Cartão
            </Typography>
            <form onSubmit={handleSubmit}>

              {/* Campo de busca e seleção de prefeitura */}
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
                  />
                )}
              />

              {/* Campo de busca e seleção de órgão responsável */}
              <Autocomplete
                options={filteredOrgaos}
                getOptionLabel={(option) => option.nome}
                value={orgaos.find((orgao) => orgao.id === formData.orgaoResponsavel) || null}
                onChange={(_, newValue) => {
                  setFormData((prev) => ({ ...prev, orgaoResponsavel: newValue ? newValue.id : "" }));
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
                  />
                )}
              />

              <Grid container spacing={2} marginTop={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Senha"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={handleInputChange}
                    error={!!errors.senha}
                    helperText={errors.senha}
                    margin="normal"
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

              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button type="button" variant="outlined" color="secondary" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Cadastrar
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}