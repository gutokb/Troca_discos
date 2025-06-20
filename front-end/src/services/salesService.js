import axios from "axios";
import { API_URL } from "../config/api.js";


export async function sellCart(userId) {
    try {
        const result = await axios.post(`${API_URL}/sales/sell/${userId}`)
        return true;
    }
    catch (error) {
        console.log(error);
        console.log(error.response)
        if (error.response.status === 400) {
            return {error : "O carrinho está vazio"};
        }
        if (error.response.status === 404) {
            return {error : "Usuário não encontrado"};
        }
        if (error.response.status === 500) {
            return {error : "Houve um problema com o servidor..."}
        }
        return {error : error.response.data.message};
    }
}