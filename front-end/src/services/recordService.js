import axios from "axios";
import {API_URL} from "../config/api.js";


export async function getAllRecords() {
    try {
        const result = await axios.get(API_URL + "/records");
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}
export async function getRecordById(id) {
    try {
        const result = await axios.get(API_URL + "/records/" + id);
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}
export async function getRecordsBySearch(search) {
    try {
        const result = await axios.get(API_URL + "/records?search=" + search);
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}

export async function createRecord(recordData) {
    try {
        const result = await axios.post(API_URL + "/records", recordData);
        return result.data;
    }
    catch (error) {
        console.log(error.response.data.error);
        return {error : error.response.data.error};
    }
}
export async function updateRecord(recordId, recordData) {
    try {
        const result = await axios.put(API_URL + "/records/" + recordId, recordData);
        return result.data;
    }
    catch (error) {
        if (error.response) {
            console.log(error.response.data.error);
            return {error : error.response.data.error};
        }
        return {error : "Não encontrado"};
    }
}
export async function deleteRecord(id) {
    try {
        const result = await axios.delete(API_URL + "/records/" + id);
        return true
    }
    catch (error) {
        console.log(error.message);
        return {error : "Não encontrado"}
    }
}
