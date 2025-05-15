import axios from "axios";

export const API_URL = `http://127.0.0.1:8000`

const $api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

export default $api;