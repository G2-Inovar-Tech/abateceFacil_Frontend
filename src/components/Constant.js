
class Constants {
   static API_BASE_URL = "https://ab.api.g2abastecimento.com.br";
    //static API_BASE_URL = "https://test.api.g2abastecimento.com.br";

    //Consultas
    static API_CONSULTAR_PREFEITURA = `${Constants.API_BASE_URL}/api/prefeitura`;
    static API_LISTAR_PREFEITURA = `${Constants.API_BASE_URL}/api/listarPrefeitura`;
   //static API_LISTAR_PREFEITURA = "https://g2inovartech.com.br/api/listarPrefeitura";
  static API_LISTAR_ABASTECIMENTO_PRE = `${Constants.API_BASE_URL}/api/abastecimentosPrefeitura`;
    //static API_LISTAR_ABASTECIMENTO_PRE = "https://g2inovartech.com.br/api/listarAbastecimentosPrefeitura";
    static API_CONSULTAR_CONTRATO = `${Constants.API_BASE_URL}/api/contrato`;
    static API_CONSULTAR_POSTO =`${Constants.API_BASE_URL}/api/postos`;
    static API_CONSULTAR_USUARIO = `${Constants.API_BASE_URL}/api/users`;
    static API_CONSULTAR_ENDERECO = `${Constants.API_BASE_URL}/api/enderecos`;
    static API_CONSULTAR_ORGAO = `${Constants.API_BASE_URL}/api/orgaos`;
    static API_CONSULTAR_CARTAO = `${Constants.API_BASE_URL}/api/cartao`;
    



    //Cadastro
    static API_CADASTRAR_CARTAO = `${Constants.API_BASE_URL}/api/cartao`;
    static API_CADASTRAR_POSTO = `${Constants.API_BASE_URL}/api/postos`;
    static API_CADASTRAR_PREFEITURA = `${Constants.API_BASE_URL}/api/prefeitura`;
    static API_CADASTRAR_USUARIO = `${Constants.API_BASE_URL}/api/users`;
    static API_CADASTRAR_VEICULO = `${Constants.API_BASE_URL}/api/veiculo`;
    static API_CADASTRAR_CONTRATO = `${Constants.API_BASE_URL}/api/contrato`;
    static API_CADASTRAR_ABASTECIMENTO = `${Constants.API_BASE_URL}/api/abastecimentosPrefeitura`;
    static API_CADASTRAR_ENDERECO = `${Constants.API_BASE_URL}/api/enderecos`
    static API_CADASTRAR_ORGAO = `${Constants.API_BASE_URL}/api/orgaos`;

    //Vincular
    static API_VINCULAR_CONTRATO_POSTO = `${Constants.API_BASE_URL}/api/contratoPosto`
    static API_VINCULAR_USUARIO_POSTO = `${Constants.API_BASE_URL}/api/vincularPosto`
    static API_VINCULAR_USUARIO_PREFEITURA = `${Constants.API_BASE_URL}/api/vincularPrefeitura`

    //Adicionar e Remover
    static API_ADICIONAR_SALDO = `${Constants.API_BASE_URL}/api/adicionarSaldo`;
    static API_REMOVER_SALDO = `${Constants.API_BASE_URL}/api/removerSaldo`;

    //Login
    static API_LOGIN = `${Constants.API_BASE_URL}/api/login`;
    //static API_LOGIN = "https://g2inovartech.com.br/api/login"

}

export default Constants;