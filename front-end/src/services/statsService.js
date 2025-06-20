import axios from "axios";
import {API_URL} from "../config/api.js";

export async function getData() {
    try {
        const response = await axios.get(`${API_URL}/stats/`);
        return response.data;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}