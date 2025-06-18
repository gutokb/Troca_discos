import axios from "axios";
import {API_URL} from "../config/api.js";


export async function getAllUsers() {
    try {
        const result = await axios.get(API_URL + "/users");
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}
export async function getUserById(id) {
    try {
        const result = await axios.get(API_URL + "/users/" + id);
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}
export async function getUsersByName(name) {
    try {
        const result = await axios.get(API_URL + "/users?name=" + name);
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}
export async function getUserByEmail(email) {
    try {
        const result = await axios.get(API_URL + "/users?email=" + email);
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}
export async function createUser(userData) {
    try {
        const result = await axios.post(API_URL + "/users", userData);
        return result.data;
    }
    catch (error) {
        console.log(error.response.data.error);
        return {error : error.response.data.error};
    }
}
export async function updateUser(userId, userData) {
    try {
        const result = await axios.put(API_URL + "/users/" + userId, userData);
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
export async function deleteUser(id) {
    try {
        const result = await axios.delete(API_URL + "/users/" + id);
        return true
    }
    catch (error) {
        console.log(error.message);
        return {error : "Não encontrado"}
    }
}
