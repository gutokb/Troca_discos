// Importa o Axios, biblioteca para fazer requisições HTTP
import axios from "axios";

// Importa a constante com a URL base da API, definida em outro arquivo de configuração
import { API_URL } from "../config/api.js";

// Função assíncrona que busca dados estatísticos da API
export async function getData() {
    try {
        // Faz uma requisição GET para a rota "/stats/" da API
        const response = await axios.get(`${API_URL}/stats/`);

        // Retorna os dados recebidos do servidor (presente em response.data)
        return response.data;
    }
    catch (error) {
        // Se houver erro na requisição (como falha de rede ou erro 500), exibe no console
        console.log(error);

        // Retorna null indicando falha na obtenção dos dados
        return null;
    }
}
