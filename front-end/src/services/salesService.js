// Importa o Axios para fazer requisições HTTP
import axios from "axios";

// Importa a URL base da API
import { API_URL } from "../config/api.js" ;

// Função assíncrona que finaliza (vende) o carrinho de um usuário, enviando uma requisição POST.
// A rota usada é: /sales/sell/:userId
// Retorna true se a venda for concluída com sucesso.
// Em caso de erro, trata códigos de status específicos (400, 404, 500) com mensagens amigáveis.
export async function sellCart(userId) {
    try {
        const result = await axios.post(`${API_URL}/sales/sell/${userId}`);
        return true;
    } catch (error) {
        console.log(error);
        console.log(error.response);

        if (error.response.status === 400) {
            return { error: "O carrinho está vazio" };
        }
        if (error.response.status === 404) {
            return { error: "Usuário não encontrado" };
        }
        if (error.response.status === 500) {
            return { error: "Houve um problema com o servidor..." };
        }

        // Retorna mensagem genérica se o erro não for tratado explicitamente
        return { error: error.response.data.message };
    }
}
