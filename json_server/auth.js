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

  const dbFilePath = path.join(__dirname, 'db.json');
  const db = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
  const user = db.users.find(
    u => u.email === email && u.password === password
  );

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

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`✅ JSON Server rodando em http://localhost:${PORT}`);
});
