// Importa o Axios para realizar requisições HTTP
import axios from "axios";

// Importa a URL base da API definida externamente
import { API_URL } from "../config/api.js";

// Função para buscar todos os registros existentes na API
export async function getAllRecords() {
    try {
        const result = await axios.get(API_URL + "/records");
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

// Função para buscar um único registro pelo seu ID
export async function getRecordById(id) {
    try {
        const result = await axios.get(API_URL + "/records/" + id);
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

// Função para buscar registros com base em uma string de pesquisa (query param `search`)
export async function getRecordsBySearch(search) {
    try {
        const result = await axios.get(API_URL + "/records?search=" + search);
        return result.data;
    } catch (error) {
        console.log(error);
        return { error: "Não encontrado" };
    }
}

// Função para criar um novo registro.
// OBS: comentário indica que houve complexidade ao lidar com arquivos de áudio no backend.
export async function createRecord(recordData) {
    try {
        const result = await axios.post(API_URL + "/records", recordData);
        return result.data;
    } catch (error) {
        console.log(error.response.data.error);
        return { error: error.response.data.error };
    }
}

// Função para atualizar um registro existente com base no ID
export async function updateRecord(recordId, recordData) {
    try {
        const result = await axios.put(API_URL + "/records/" + recordId, recordData);
        return result.data;
    } catch (error) {
        if (error.response) {
            console.log(error.response.data.error);
            return { error: error.response.data.error };
        }
        return { error: "Não encontrado" };
    }
}

// Função para excluir um registro com base no ID
export async function deleteRecord(id) {
    try {
        const result = await axios.delete(API_URL + "/records/" + id);
        return true;
    } catch (error) {
        console.log(error.message);
        return { error: "Não encontrado" };
    }
}
