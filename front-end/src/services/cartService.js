// Importa o Axios para realizar requisições HTTP
import axios from "axios";

// Importa a URL base da API
import { API_URL } from "../config/api.js";

/**
 * Adiciona um item (registro) ao carrinho do usuário especificado.
 * Envia o ID do registro e a quantidade via corpo da requisição POST.
 */
export async function CartAddRecord(userId, recordId, quantity) {
    try {
        let cartData = {
            quantity: quantity,
            recordId: recordId
        };
        const result = await axios.post(API_URL + "/cart/add/" + userId, cartData);
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

/**
 * Atualiza a quantidade de um item no carrinho de um usuário.
 * Utiliza a rota PUT para alterar a quantidade de um registro específico.
 */
export async function cartSetQuantityRecord(userId, recordId, quantity) {
    try {
        let cartData = {
            quantity: quantity,
            recordId: recordId
        };
        const result = await axios.put(API_URL + "/cart/set-quantity/" + userId, cartData);
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

/**
 * Remove um item específico do carrinho do usuário.
 * Usa DELETE com `data` no corpo da requisição (padrão do Axios para DELETE com payload).
 */
export async function cartRemoveRecord(userId, recordId) {
    try {
        const body = {
            recordId: recordId
        };

        const result = await axios.delete(`${API_URL}/cart/remove/${userId}`, {
            data: body
        });
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

//Limpa completamente o carrinho do usuário, removendo todos os itens.

export async function cartClearRecords(userId) {
    try {
        const result = await axios.delete(API_URL + "/cart/clear/" + userId);
        console.log(result.data); // Log opcional, pode ser removido em produção
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}
