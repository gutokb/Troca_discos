import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { email, password } = req.body;

  const db = router.db;
  const user = db.get('users').find({ email, password }).value();

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  res.json({
    token: 'fake-jwt-token',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

server.post('/register', (req, res) => {
  const { name, email, password, cpf, telephone, role = "USER" } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Nome, email e senha são obrigatórios." });
  }

  const db = router.db;
  const existingUser = db.get('users').find({ email }).value();

  if (existingUser) {
    return res.status(409).json({ message: "Email já está em uso." });
  }

  const newUser = {
    id: String(Date.now()),
    name,
    cpf,
    email,
    telephone,
    role,
    password,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    shopping_cart: []
  };

  db.get('users').push(newUser).write();

  res.status(201).json({ message: "Usuário registrado com sucesso!", user: newUser });
});

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON Server rodando em http://localhost:${PORT}`);
});
