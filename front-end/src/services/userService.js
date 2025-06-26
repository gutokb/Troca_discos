// Importa o Axios para fazer requisições HTTP
import axios from "axios";

// Importa a URL base da API definida no arquivo de configuração
import { API_URL } from "../config/api.js";

// Função para buscar todos os usuários
export async function getAllUsers() {
    try {
        const result = await axios.get(API_URL + "/users"); // Requisição GET para /users
        return result.data; // Retorna os dados da resposta
    } catch (error) {
        console.log(error); // Mostra erro no console
        return { error: "Não encontrado" }; // Retorno padrão de erro
    }
}

// Função para buscar um usuário por ID
export async function getUserById(id) {
    try {
        const result = await axios.get(API_URL + "/users/" + id); // GET /users/:id
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

// Função para buscar usuários por nome (via query string)
export async function getUsersByName(name) {
    try {
        const result = await axios.get(API_URL + "/users?name=" + name); // GET /users?name=...
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

// Função para buscar um usuário por email (via query string)
export async function getUserByEmail(email) {
    try {
        const result = await axios.get(API_URL + "/users?email=" + email); // GET /users?email=...
        return result.data; 
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

// Função para criar um novo usuário
export async function createUser(userData) {
    try {
        const result = await axios.post(API_URL + "/users", userData); // POST /users com os dados no corpo
        return result.data;
    } catch (error) {
        // Captura o erro retornado pela API (ex: validação, duplicidade etc.)
        console.log(error.response.data.error);
        return { error: error.response.data.error };
    }
}

// Função para atualizar um usuário existente
export async function updateUser(userId, userData) {
    try {
        const result = await axios.put(API_URL + "/users/" + userId, userData); // PUT /users/:id
        return result.data;
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.error);
            return { error: error.response.data.error };
        }
        return { error: "Não encontrado" };
    }
}

// Função para deletar um usuário por ID
export async function deleteUser(id) {
    try {
        await axios.delete(API_URL + "/users/" + id); // DELETE /users/:id
        return true; // Sucesso
    } catch (error) {
        console.log(error.message);
        return { error: "Não encontrado" };
    }
}
