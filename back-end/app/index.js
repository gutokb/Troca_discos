// Importa as variáveis de ambiente do arquivo .env (como MONGO_URI e PORT)
import "dotenv/config";

// Importa o Mongoose para conectar com o banco de dados MongoDB
import mongoose from "mongoose";

// Importa o Express para criar a aplicação backend (servidor HTTP)
import express from "express";

// Importa os arquivos de rotas, que definem os endpoints da API
import userRouter from "./route/userRoutes.js";
import cartRouter from "./route/cartRoutes.js";
import recordRouter from "./route/recordRoutes.js";
import audioRouter from "./route/audioRoutes.js";
import salesRouter from "./route/salesRoutes.js";
import statsRouter from "./route/statsRoutes.js";

// Importa o middleware CORS, que permite requisições de diferentes origens (ex: frontend em localhost:5173)
import cors from "cors";

/**
 * Middleware para logar todas as requisições feitas à API.
 * Mostra o método HTTP, a rota acessada, o status da resposta e o tempo de resposta.
 */
const requestLogger = (req, res, next) => {
    const start = Date.now(); // marca o início da requisição

    const originalEnd = res.end; // guarda o método original para ser chamado depois

    // Sobrescreve o método res.end para inserir o log
    res.end = function(...args) {
        const duration = Date.now() - start; // calcula tempo decorrido
        const timestamp = new Date().toISOString();

        console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);

        // Chama a função original para encerrar a resposta normalmente
        originalEnd.apply(this, args);
    };

    next(); // passa para o próximo middleware
};

/**
 * Função principal da aplicação, executada ao iniciar o backend.
 * Realiza conexão com o banco e define todas as configurações do servidor.
 */
async function main() {
    try {
        // Conecta ao MongoDB usando a URI do .env
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");
    } catch (error) {
        // Se der erro na conexão, mostra o erro e encerra o programa
        console.error(error);
        process.exit(1);
    }

    // Cria a aplicação Express
    const app = await express();

    // Aplica os middlewares globais
    app.use(cors());              // Permite acesso da aplicação frontend
    app.use(requestLogger);       // Loga todas as requisições
    app.use(express.json());      // Permite receber requisições JSON (corpo da requisição)

    // Define os endpoints da API para cada parte da aplicação
    app.use("/api/users", userRouter);     // Endpoints relacionados a usuários
    app.use("/api/cart", cartRouter);      // Endpoints do carrinho
    app.use("/api/records", recordRouter); // Endpoints de produtos (discos)
    app.use("/api/audio", audioRouter);    // Endpoints para manipulação de áudios
    app.use("/api/sales", salesRouter)       // Endpoint para venda de produtos
    app.use("/api/stats", statsRouter)

    // Inicia o servidor escutando na porta especificada no .env
    app.listen(process.env.PORT, (err) => {
        if (err) console.log(err);
        else console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
}

// Executa a função principal e captura possíveis erros de forma segura
main().catch((err) => {
    console.log(err);
});
