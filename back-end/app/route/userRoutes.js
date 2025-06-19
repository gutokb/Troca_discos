// Importa o roteador do Express
import express from 'express';

// Importa todas as funções do controlador de usuário
import * as userController from '../controller/userController.js';

// Cria uma nova instância de roteador
const router = express.Router();

// =======================================================
// Rota: GET /api/users
// Descrição: Retorna todos os usuários, ou faz busca por name/email via query string
// Exemplo: /api/users?name=fulano ou /api/users?email=fulano@email.com
// =======================================================
router.get('/', userController.get);

// =======================================================
// Rota: GET /api/users/:id
// Descrição: Retorna um usuário específico pelo ID
// =======================================================
router.get('/:id', userController.getById);

// =======================================================
// Rota: POST /api/users
// Descrição: Cria um novo usuário no sistema
// =======================================================
router.post("/", userController.create);

// =======================================================
// Rota: PUT /api/users/:id
// Descrição: Atualiza os dados de um usuário existente
// =======================================================
router.put("/:id", userController.update);

// =======================================================
// Rota: DELETE /api/users/:id
// Descrição: Remove um usuário do sistema
// =======================================================
router.delete("/:id", userController.deleteUser);

// =======================================================
// Rota: POST /api/users/login
// Descrição: Autentica um usuário com email e senha
// =======================================================
router.post('/login', userController.login);

// Exporta o roteador para ser usado no index.js do backend
export default router;
