# Troca Discos: Uma loja virtual para Discos de Vinil

## Projeto final da disciplina de Introdução ao Desenvolvimento Web


### Realizado pelos alunos
- Felipe Carneiro Machado -  14569373
- Laura Neri Thomaz da Silva - 13673221
- Augusto Cavalcante Barbosa Pereira - 14651531


### Descrição

O projeto consiste em implementar uma plataforma Web que atuará como loja virtual para venda de discos de vinil.

### Requisitos específicos do projeto

Como se trata de um e-shop relacionado à música, a loja terá junto à página de produto um player que reproduzirá as faixas do álbum. Ademais, todas as funcionalidades padrão de uma loja virtual devem ser implementadas.

Usuários devem poder:
- Cadastrar-se na loja
- Buscar e acessar todos os produtos disponíveis na loja
- Efetuar compra de qualquer produto disponível na loja

Administradores do sistema devem poder:
- Adicionar, remover e alterar produtos
- Adicionar, remover e alterar usuários
- Visualizar estatísticas sobre suas vendas


#### Comentários sobre o código

Para o Milestone 2, o código do Front End está localizado na pasta `front-end`. Adicionalmente, o json server utilizado para testes e seus dados estão na pasta `json_server`. Segue abaixo a estrutura de diretórios comentada.

#### Estrutura de diretórios 
```
.
├── public # Recursos acessados por usuários
│   └── audio # Faixas de áudio dos produtos
└── src
    ├── main.jsx # Ponto de entrada da aplicação
    ├── assets
    ├── components # Componentes utilzados para construir as páginas
    │   ├── LoginForm
    │   ├── Navbar
    │   ├── ProductCard
    │   ├── productDetails
    │   ├── ProductPage
    │   ├── ProfilePage
    │   ├── ProtectedRoute
    │   ├── RegisterForm
    │   ├── ShoppingCart
    │   ├── Sidebar
    │   ├── StatisticsPage
    │   │   └── charts # Implementação de gráficos
    │   └── UserPage
    ├── config # Arquivos de configuração
    └── pages # Layouts de página
        ├── Admin
        ├── Cart
        ├── Details
        ├── Home
        ├── Login
        ├── Profile
        ├── Register
        ├── Search
        └── Unauthorized

```

#### Plano de testes

Para esta etapa, a interface Web foi testada manualmente a partir do uso de um json server, com dados forjados. Não foram implementados testes automatizados nesta etapa, mas planeja-se utilizá-los para o servidor, que será implementado no Milestone 3.

#### Resultados de testes

A aplicação não falhou em nenhuma inspeção manual, foi possível executar todas as operações de CRUD em usuários e produtos, além de executar sem erros navegação, busca e compra.

#### Procedimento para execução

Executar a aplicação requer ter o Node.js instalado. 

Para instalar as dependências:
```bash
    cd front-end
    npm install
```
Para executar em modo de teste:
```bash
   npm run dev
```
Para testar também é necessário executar o json server:
```bash
    cd json_server
    npm install
    node auth.js
```

Para compilar para distribuição:
```bash
   npm build 
```

#### Problemas

Não houve problemas significativos no decorrer do projeto.

#### Comentários

Não há comentários extras relevantes sobre o projeto. 
