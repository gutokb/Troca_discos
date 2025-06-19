// Importa os métodos de serviço relacionados a usuários
import * as userService from '../service/userService.js';

// Estas duas linhas são desnecessárias e devem ser removidas — req e res já vêm da função do Express
import req from "express/lib/request.js";
import res from "express/lib/response.js";

// =====================================================
// Função GET /api/users - Lista usuários ou busca por nome/email
// =====================================================
export async function get(req, res) {
    // Se vier uma query ?name=...
    if (!!req.query?.name) {
        const result = await userService.getUsersByName(req.query.name);
        if (result) {
            return res.status(200).json(result); // retorna usuários encontrados por nome
        }
        return res.status(404).end(); // nenhum usuário encontrado
    }

    // Se vier uma query ?email=...
    if (!!req.query?.email) {
        const result = await userService.getUserByEmail(req.query.email);
        if (result) {
            return res.status(200).json(result); // retorna usuário com aquele email
        }
        return res.status(404).end(); // nenhum encontrado
    }

    // Se nenhuma query foi passada, retorna todos os usuários
    return res.status(200).json(await userService.getAllUsers());
}

// =====================================================
// Função GET /api/users/:id - Busca um usuário por ID
// =====================================================
export async function getById(req, res) {
    try {
        const result = await userService.getUserById(req.params.id);
        if (!result) {
            return res.status(404).json({}); // usuário não encontrado
        }
        return res.status(200).json(result); // usuário encontrado
    } catch (err) {
        return res.status(500).json(err.message); // erro inesperado
    }
}

// =====================================================
// Função POST /api/users - Cria um novo usuário
// =====================================================
export async function create(req, res) {
    const userData = req.body; // dados do usuário enviados no corpo da requisição
    try {
        const createdUser = await userService.createUser(userData);
        // Retorna apenas informações relevantes
        res.status(201).json({
            message: "Usuário criado com sucesso",
            user: {
                id: createdUser._id,
                name: createdUser.name,
                email: createdUser.email,
                role: createdUser.role
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message }); // erro de validação
    }
}

// =====================================================
// Função PUT /api/users/:id - Atualiza dados de um usuário
// =====================================================
export async function update(req, res) {
    const userData = req.body;
    try {
        const updatedUser = await userService.updateUser(req.params.id, userData);
        if (updatedUser.matchedCount === 0) {
            return res.status(404).end(); // nenhum usuário com aquele ID
        }
        return res.status(200).json(updatedUser); // sucesso
    } catch (err) {
        res.status(400).json({ error: err.message }); // erro de validação ou estrutura
    }
}

// =====================================================
// Função DELETE /api/users/:id - Remove um usuário
// =====================================================
export async function deleteUser(req, res) {
    try {
        const result = await userService.deleteUser(req.params.id);
        if (result.matchedCount === 0) {
            return res.status(404).end(); // nada foi deletado
        }
        return res.status(200).end(); // sucesso
    } catch (err) {
        res.status(500).json({ error: err.message }); // erro interno
    }
}

// =====================================================
// Função POST /api/users/login - Autentica o login do usuário
// =====================================================
export async function login(req, res) {
    const { email, password } = req.body;

    try {
        const user = await userService.authenticateUser(email, password);

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" }); // email/senha errados
        }

        // Atualiza o último login
        user.lastLoginAt = new Date();
        await user.save();

        // Retorna as informações essenciais
        res.status(200).json({
            message: "Login realizado com sucesso",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ message: "Erro interno no servidor" });
    }
}
