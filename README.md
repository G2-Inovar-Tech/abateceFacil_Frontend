# Cadastro de Usuário

Este componente React implementa a tela de **Cadastro de Usuário**, permitindo que o usuário insira dados como nome, tipo, telefone, login e senha para cadastro em um sistema. A tela valida os dados antes de enviá-los para a API, garantindo que todos os campos obrigatórios sejam preenchidos corretamente.

## Funcionalidades

### Campos de Entrada:
- **Nome**: Nome completo do usuário.
- **Tipo**: O tipo de usuário, que pode ser **Admin**, **Prefeitura** ou **Posto**.
- **Telefone**: Número de telefone do usuário, validado para aceitar somente números, com comprimento de 10 a 15 dígitos.
- **Login**: Login de acesso ao sistema.
- **Senha**: Senha para acesso ao sistema, sendo um campo obrigatório.

### Validação:
- O formulário realiza a validação dos campos antes de enviá-los para a API, garantindo que:
  - Todos os campos obrigatórios estejam preenchidos.
  - O telefone esteja no formato correto (somente números, entre 10 e 15 dígitos).
  - A senha tenha um valor preenchido.

### Envio de Dados:
- Após a validação, os dados são enviados para a API utilizando o método `POST`.
- **Em caso de erro** (status 422 ou outro), a mensagem de erro é exibida de forma amigável para o usuário, sem mostrar detalhes excessivos.
- **Em caso de sucesso**, o usuário recebe uma mensagem de confirmação e o formulário é limpo.

## Fluxo de Validação de Erros

Quando a API retorna um erro de cadastro, a mensagem é tratada e exibida de forma amigável ao usuário:

```js
const errorMessages = responseData.erros
  ? Object.values(responseData.erros).flat().join(", ")
  : "Erro desconhecido";
alert(`Erro ao cadastrar usuário: ${errorMessages}`);
