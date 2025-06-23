# Troca Discos: Loja Virtual de Discos de Vinil

Projeto final da disciplina **Introdução ao Desenvolvimento Web**.

## Autores

* Felipe Carneiro Machado - 14569373
* Laura Neri Thomaz da Silva - 13673221
* Augusto Cavalcante Barbosa Pereira - 14651531

---

## Descrição

O Troca Discos é uma plataforma web completa para comercialização de discos de vinil, oferecendo funcionalidades tanto para clientes quanto para administradores. O sistema permite reprodução de faixas, gerenciamento de usuários e produtos, além de relatórios estatísticos.

---

## Funcionalidades

### Para Usuários

* Cadastro e login com autenticação.
* Busca e visualização de produtos.
* Adição de produtos ao carrinho.
* Finalização de compra.
* Reprodução de trechos de faixas de áudio.

### Para Administradores

* CRUD de usuários e produtos.
* Visualização de estatísticas de vendas.

---

## Estrutura de Diretórios

```
.
├── back-end
│   ├── app
│   │   ├── controller         # Controladores das rotas
│   │   ├── index.js           # Ponto de entrada do backend
│   │   ├── model              # Modelos Mongoose (User, Record, Sale)
│   │   ├── route              # Definição das rotas da API
│   │   ├── service            # Lógica de negócio e comunicação com os modelos
│   │   └── tests              # Planejado para testes (em desenvolvimento)
│   ├── example.env           # Exemplo de configuração do ambiente
│   └── package.json
├── front-end
│   ├── public/audio          # Faixas de áudio para preview
│   ├── src
│   │   ├── components         # Componentes reutilizáveis (Navbar, Formulários, etc.)
│   │   ├── config             # Configurações globais (API_URL)
│   │   ├── pages              # Páginas principais (Home, Login, Admin, etc.)
│   │   ├── services           # Integração com a API
│   │   └── main.jsx          # Ponto de entrada da aplicação React
│   ├── index.html
│   └── package.json
├── json_server               # Ambiente de mock para testes locais (opcional)
└── Milestone1                # Protótipos de telas iniciais (HTML/CSS estático)
```

---

## Tecnologias Utilizadas

### Frontend

* React 19 com Vite
* React Router DOM
* Chart.js para estatísticas
* React Icons
* CSS Módulos

### Backend

* Node.js + Express
* MongoDB + Mongoose
* Multer (upload de arquivos)
* dotenv
* Nodemon (dev)
* Jest (testes - em progresso)

---

## Como Executar o Projeto

### Requisitos

* Node.js (v18+)
* MongoDB local

### 1. Configurar o ambiente

Crie um arquivo `.env` na pasta `back-end/` com o seguinte conteúdo:

```env
MONGO_URI=mongodb://127.0.0.1:27017/troca_discos
PORT=3001
```

### 2. Instalar dependências

```bash
# Frontend
cd front-end
npm install

# Backend
cd ../back-end
npm install
```
### 3. Popular banco de dados

inserir a pasta uploads descomprimida presente no seguinte drive https://drive.google.com/file/d/1Q58W5eSB5ciNTSDSrnJlXxfRzESRm3S6/view?usp=drive_link dentro da pasta back-end/app

### 4. Rodar o projeto

```bash
# Iniciar backend
cd back-end
npm run start

# Em outro terminal: iniciar frontend
cd front-end
npm run dev
```

Acesse o frontend em `http://localhost:5173`

---

## Observações

* O projeto está em fase final de implementação.
* Algumas funcionalidades ainda estão sendo refinadas (como upload de faixas e testes automatizados).

---

## Planejamento de Testes

* Testes manuais realizados com base no fluxo de usuário e administrador.
* Testes automatizados com Jest estão planejados para o backend.

---

## Problemas Conhecidos

* Validações de frontend ainda estão sendo aperfeiçoadas.
* Algumas mensagens de erro ainda não são exibidas de forma amigável.

---

## Licença

Este projeto é de uso educacional e não possui licença comercial.
