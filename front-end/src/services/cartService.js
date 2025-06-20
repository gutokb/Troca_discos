import axios from "axios";
import {API_URL} from "../config/api.js";


export async function CartAddRecord(userId, recordId, quantity) {
    try {
        let cartData = {
            "quantity": quantity,
            "recordId": recordId
        }
        const result = await axios.post(API_URL + "/cart/add/" + userId, cartData);
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}

export async function cartSetQuantityRecord(userId, recordId, quantity) {
    try {
         let cartData = {
            "quantity": quantity,
            "recordId": recordId
        }
        const result = await axios.put(API_URL + "/cart/set-quantity/" + userId, cartData);
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}

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

export async function cartClearRecords(userId) {
    try {
        const result = await axios.delete(API_URL + "/cart/clear/" + userId);
        console.log(result.data)
        return result.data;
    }
    catch (error) {
        console.log(error);
        return {error : "Não encontrado"}
    }
}