import axios from "axios";

const API_URL = "http://localhost:7000"

export default axios.create({
    baseURL: API_URL
})